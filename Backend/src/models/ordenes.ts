import { Preference } from "mercadopago";
import { pool } from "../config/db.js";
import type { OrdenInput, EstadoOrden } from "../schemas/ordenes.js";
import { client } from "../services/mercadopago.js";
import { env } from "../config/env.js";

export class OrdenesModel{
    static async getAll(){
        const ordenes = await pool.query(
            `SELECT 
                orden.id, 
                orden.estado, 
                orden.total, 
                orden.created_at, 
                usuario.nombre AS usuario_nombre, 
                usuario.email AS usuario_email, 
                json_agg(
                    json_build_object(
                        'nombre', producto.nombre,
                        'cantidad', detalle_orden.cantidad,
                        'precio_unitario', detalle_orden.precio_unitario
                    )
                ) AS productos
            FROM orden
            JOIN usuario ON usuario.id = orden.usuario_id
            JOIN detalle_orden ON detalle_orden.orden_id = orden.id
            JOIN producto ON producto.id = detalle_orden.producto_id
            GROUP BY 
                orden.id,
                usuario.nombre,
                usuario.email
            ORDER BY orden.created_at DESC`
        )

        return ordenes.rows
    }

    static async getByUsuario(id: number){
        const ordenes = await pool.query(
            `SELECT 
                orden.id, 
                orden.estado, 
                orden.total, 
                orden.created_at, 
                usuario.nombre AS usuario_nombre, 
                usuario.email AS usuario_email, 
                json_agg(
                    json_build_object(
                        'nombre', producto.nombre,
                        'cantidad', detalle_orden.cantidad,
                        'precio_unitario', detalle_orden.precio_unitario
                    )
                ) AS productos
            FROM orden
            JOIN usuario ON usuario.id = orden.usuario_id
            JOIN detalle_orden ON detalle_orden.orden_id = orden.id
            JOIN producto ON producto.id = detalle_orden.producto_id
            WHERE usuario.id = $1
            GROUP BY 
                orden.id,
                usuario.nombre,
                usuario.email
            ORDER BY orden.created_at DESC`, [id]
        )

        return ordenes.rows
    }

    static async getById(id: string){
        const orden = await pool.query(
            `SELECT 
                orden.id, 
                orden.estado, 
                orden.total, 
                orden.created_at, 
                usuario.nombre AS usuario_nombre, 
                usuario.email AS usuario_email, 
                json_agg(
                    json_build_object(
                        'nombre', producto.nombre,
                        'cantidad', detalle_orden.cantidad,
                        'precio_unitario', detalle_orden.precio_unitario
                    )
                ) AS productos
            FROM orden
            JOIN usuario ON usuario.id = orden.usuario_id
            JOIN detalle_orden ON detalle_orden.orden_id = orden.id
            JOIN producto ON producto.id = detalle_orden.producto_id
            WHERE orden.id = $1
            GROUP BY 
                orden.id,
                usuario.nombre,
                usuario.email
            ORDER BY orden.created_at DESC`, [id]
        )

        if(orden.rows.length === 0) return null

        return orden.rows[0]
    }

    static async create({id, input}: {id: number, input: OrdenInput}){
        const existe = await pool.query(
            `SELECT id FROM datos_facturacion WHERE usuario_id = $1`, [id]
        )
        if(existe.rows.length === 0) return null
        const datosFacturacionId = existe.rows[0].id
        
        const client = await pool.connect()
        try{
            await client.query('BEGIN')

            const itemsValidados: { producto_id: string, cantidad: number, precio_unitario: number }[] = []
            let total = 0

            const productosOrdenados = [...input.productos].sort((a, b) => a.id.localeCompare(b.id))

            for (const item of productosOrdenados) {
                const productoResult = await client.query(
                    `SELECT precio, stock FROM producto WHERE id = $1 FOR UPDATE`,
                    [item.id]
                )

                if (productoResult.rows.length === 0) {
                    throw new Error(`Producto ${item.id} no encontrado`)
                }

                const { precio, stock } = productoResult.rows[0]

                if (stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${item.id}`)
                }

                total += Number(precio) * item.cantidad

                itemsValidados.push({
                    producto_id: item.id,
                    cantidad: item.cantidad,
                    precio_unitario: Number(precio),
                })
            }

            const ordenResult = await client.query(
                `INSERT INTO orden(usuario_id, datos_facturacion_id, total, estado)
                VALUES($1, $2, $3, $4)
                RETURNING id`,
                [id, datosFacturacionId, total, 'PENDIENTE']
            )
            const ordenId = ordenResult.rows[0].id

            for (const item of itemsValidados) {
                await client.query(
                    `INSERT INTO detalle_orden(orden_id, producto_id, cantidad, precio_unitario)
                    VALUES($1, $2, $3, $4)`,
                    [ordenId, item.producto_id, item.cantidad, item.precio_unitario]
                )

                await client.query(
                    `UPDATE producto SET stock = stock - $1 WHERE id = $2`,
                    [item.cantidad, item.producto_id]
                )
            }

            await client.query('COMMIT')

            return await OrdenesModel.getById(ordenId)
        }catch(error){
            await client.query('ROLLBACK')
            throw error
        }finally{
            client.release()
        }
    }

    static async updateEstado({ ordenId, nuevoEstado }: { ordenId: string, nuevoEstado: EstadoOrden }){
        const TRANSICIONES: Record<EstadoOrden, EstadoOrden[]> = {
            PENDIENTE:  ['PAGADO', 'CANCELADA'],
            PAGADO:     ['ENVIADO', 'CANCELADA'],
            ENVIADO:    ['COMPLETADA'],
            COMPLETADA: [],
            CANCELADA:  [],
        }

        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            // Bloquear la orden mientras se procesa
            const ordenResult = await client.query(
                `SELECT id, estado FROM orden WHERE id = $1 FOR UPDATE`, [ordenId]
            )

            if (ordenResult.rows.length === 0) {
                throw new Error('Orden no encontrada')
            }

            const estadoActual: EstadoOrden = ordenResult.rows[0].estado

            if (!TRANSICIONES[estadoActual].includes(nuevoEstado)) {
                throw new Error(`Transición inválida: no se puede pasar de ${estadoActual} a ${nuevoEstado}`)
            }

            // Devolver stock si se cancela
            if (nuevoEstado === 'CANCELADA') {
                const detalles = await client.query(
                    `SELECT producto_id, cantidad FROM detalle_orden WHERE orden_id = $1`, [ordenId]
                )

                for (const detalle of detalles.rows) {
                    await client.query(
                        `UPDATE producto SET stock = stock + $1 WHERE id = $2`,
                        [detalle.cantidad, detalle.producto_id]
                    )
                }
            }

            await client.query(
                `UPDATE orden SET estado = $1 WHERE id = $2`,
                [nuevoEstado, ordenId]
            )

            await client.query('COMMIT')

            return await OrdenesModel.getById(ordenId)
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    }

    // Creamos el metodo para manejar los pagos, recibe orden_id y usuario_id como parametro
    static async crearPreferenciaPago({orden_id, usuario_id}: {orden_id: string, usuario_id: number}){
        // Buscamos la orden por su id
        const orden = await pool.query(
            `SELECT usuario_id, estado FROM orden
            WHERE id = $1`, [orden_id] // Traemos usuario_id y estado
        )
        // Si la query no trae datos o si el usuario_id no corresponde con el del parametro tiramos un error
        if(orden.rows.length === 0 || orden.rows[0].usuario_id !== usuario_id) throw new Error('La orden no existe')
        // Si el estado de la orden es diferente a PENDIENTE tiramos un error
        if(orden.rows[0].estado !== 'PENDIENTE') throw new Error('La orden no está pendiente de pago')

        // Buscamos los detalle de la orden
        const detalleOrden = await pool.query(
            `SELECT p.nombre, det.producto_id, det.cantidad, det.precio_unitario
            FROM detalle_orden det
            JOIN producto p ON p.id = det.producto_id
            WHERE det.orden_id = $1`, [orden_id] // Traemos el nombre del producto con el JOIN y los detalles de la ordenç
        )
        
        // Para cada producto de la orden creamos un objeto con sus datos y lo guardamos en un array 
        const items = detalleOrden.rows.map(p => ({
            id: p.producto_id,
            title: p.nombre,
            quantity: p.cantidad,
            unit_price: Number(p.precio_unitario),
            currency_id: 'ARS'
        }))

        // Iniciamos una instancia de preference de mercadopago e utilizamos el cliente de la configuracion 
        const preference = new Preference(client)
        // Llama a la instancia para crear una "preferencia de pago", un objeto que describe QUÉ se va a cobrar y CÓMO manejar el resultado
        const resultado = await preference.create({
            body: {
                items, // datos de los productos
                external_reference: orden_id, // id de la orden del usuario para saber a que orden corresponde ese pago
                
                // URLs del frontend a las que MercadoPago redirige al usuario después de que intenta pagar, según cómo haya salido
                back_urls: {
                    success: 'http://localhost:3000/pago/exito',
                    failure: 'http://localhost:3000/pago/error',
                    pending: 'http://localhost:3000/pago/pendiente'
                },
                notification_url: env.WEBHOOK_URL
            }
        })

        // Extraemos de resultado preferenceId e init_point
        const { id: preferenceId, init_point } = resultado
        // Insertamos el preferenceId en la tabla orden
        await pool.query(
            `UPDATE orden SET preference_id = $1
            WHERE id = $2`, [preferenceId, orden_id]
        )

        // Retornamos init_point
        return {init_point}
    }
}