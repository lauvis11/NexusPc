import { pool } from "../config/db.js";
import type { OrdenInput } from "../schemas/ordenes.js";

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
        
        const client = await pool.connect()
        try{
            await client.query('BEGIN')

            const itemsValidados: { producto_id: string, cantidad: number, precio_unitario: number }[] = []
            let total = 0

            for (const item of input.productos) {
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

                total += precio * item.cantidad

                itemsValidados.push({
                    producto_id: item.id,
                    cantidad: item.cantidad,
                    precio_unitario: precio,
                })
            }

            const ordenResult = await client.query(
                `INSERT INTO orden(usuario_id, total, estado)
                VALUES($1, $2, $3)
                RETURNING id`,
                [id, total, 'PENDIENTE']
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
}