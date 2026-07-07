import { pool } from "../config/db.js";
import type { ProductoNuevo } from "../schemas/productos.js"

export class ProductosModel{
    static async getAll({ categoria }: {categoria?: string | undefined}){
        if(categoria){
            const producto = await pool.query(
                `SELECT producto.id, producto.nombre, descripcion, precio, stock, img_url, public_id, created_at, categoria.nombre as categoria FROM producto
                JOIN categoria ON categoria.id = producto.categoria_id
                WHERE categoria.nombre = $1
                `, [categoria]
            )

            return producto.rows
        }
        const productos = await pool.query(
            `SELECT producto.id, producto.nombre, descripcion, precio, stock, img_url, public_id, created_at, categoria.nombre as categoria FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            `
        )

        return productos.rows
    }

    static async getById(id: string){
        const producto = await pool.query(
            `SELECT producto.id, producto.nombre, descripcion, precio, stock, img_url, public_id, created_at, categoria.nombre as categoria FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            WHERE producto.id = $1
            `, [id]
        )

        if(producto === undefined) return null

        return producto.rows[0]
    }

    static async create(input: ProductoNuevo){
        const client = await pool.connect()

        const {
            nombre,
            descripcion, 
            precio,
            stock,
            img_url,
            public_id,
            categoria_id,
            caracteristicas
        } = input

        try{
            await client.query(
                `BEGIN`
            )

            const result = await client.query(
                `INSERT INTO producto(nombre, descripcion, precio, stock, img_url, public_id, categoria_id)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
                `, [nombre, descripcion, precio, stock, img_url, public_id, categoria_id] 
            ) 

            const productoId = result.rows[0].id

            for (const caracteristica of caracteristicas) {
                await client.query(
                    `INSERT INTO caracteristica_producto(clave, valor, producto_id)
                    VALUES($1, $2, $3)
                    `, [caracteristica.clave, caracteristica.valor, productoId]
                )
            }

            await client.query(
                `COMMIT`
            )

            const productoCreado = await ProductosModel.getById(productoId)
            return productoCreado
        }catch(error){
            await client.query(
                `ROLLBACK`
            )
            throw error
        }finally{
            client.release()
        }
    }
}