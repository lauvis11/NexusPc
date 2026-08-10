import { pool } from "../config/db.js";
import type { ProductoNuevo } from "../schemas/productos.js"

export class ProductosModel{
    static async getAll({
        categoria,
        subcategoria_id,
        precio_min,
        precio_max,
        en_stock,
        busqueda,
        page = 1,
        limit = 20
    }: {
        categoria?: string
        subcategoria_id?: number
        precio_min?: number
        precio_max?: number
        en_stock?: boolean
        busqueda?: string
        page?: number
        limit?: number
    }) {
        const conditions: string[] = []
        const values: (string | number)[] = []

        // Filtros ya existentes
        if (categoria) {
            values.push(categoria)
            conditions.push(`categoria.nombre = $${values.length}`)
        }

        if (subcategoria_id !== undefined) {
            values.push(subcategoria_id)
            conditions.push(`producto.subcategoria_id = $${values.length}`)
        }

        // Filtros nuevos — todos parametrizados, sin interpolación de valores
        if (precio_min !== undefined) {
            values.push(precio_min)
            conditions.push(`producto.precio >= $${values.length}`)
        }

        if (precio_max !== undefined) {
            values.push(precio_max)
            conditions.push(`producto.precio <= $${values.length}`)
        }

        if (en_stock === true) {
            conditions.push(`producto.stock > 0`)
        }

        if (busqueda) {
            // El patrón % se construye en TypeScript y se pasa como valor parametrizado
            values.push(`%${busqueda}%`)
            conditions.push(`producto.nombre ILIKE $${values.length}`)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        // 1. Obtener total de productos filtrados (con los mismos filtros)
        const countQuery = `
            SELECT COUNT(DISTINCT producto.id) AS total
            FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            LEFT JOIN subcategoria ON subcategoria.id = producto.subcategoria_id
            LEFT JOIN oferta ON oferta.producto_id = producto.id
                AND oferta.activo = true
                AND oferta.fecha_inicio <= NOW()
                AND oferta.fecha_fin >= NOW()
            ${whereClause}
        `
        const countResult = await pool.query(countQuery, values)
        const total = parseInt(countResult.rows[0]?.total ?? '0', 10)

        // 2. Obtener los productos paginados
        const offset = (page - 1) * limit
        const limitParamIndex = values.length + 1
        const offsetParamIndex = values.length + 2

        const query = `
            SELECT 
                producto.id, 
                producto.nombre, 
                descripcion, 
                precio, 
                stock, 
                img_url, 
                public_id, 
                producto.created_at, 
                categoria.nombre as categoria,
                subcategoria.nombre as subcategoria,
                producto.subcategoria_id,
                json_agg(
                    json_build_object(
                        'clave', caracteristica_producto.clave,
                        'valor', caracteristica_producto.valor
                    )
                ) AS caracteristicas,
                CASE 
                    WHEN oferta.id IS NOT NULL THEN
                        CASE oferta.tipo
                            WHEN 'porcentaje' THEN ROUND(producto.precio - (producto.precio * oferta.valor / 100), 2)
                            WHEN 'monto_fijo' THEN ROUND(producto.precio - oferta.valor, 2)
                        END
                    ELSE NULL
                END AS precio_oferta,
                oferta.tipo AS oferta_tipo,
                oferta.valor AS oferta_valor
            FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            LEFT JOIN subcategoria ON subcategoria.id = producto.subcategoria_id
            LEFT JOIN caracteristica_producto ON caracteristica_producto.producto_id = producto.id
            LEFT JOIN oferta ON oferta.producto_id = producto.id
                AND oferta.activo = true
                AND oferta.fecha_inicio <= NOW()
                AND oferta.fecha_fin >= NOW()
            ${whereClause}
            GROUP BY producto.id, categoria.nombre, subcategoria.nombre, oferta.id
            ORDER BY producto.created_at DESC, producto.id DESC
            LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
        `

        const paginatedValues = [...values, limit, offset]
        const productos = await pool.query(query, paginatedValues)

        return {
            data: productos.rows,
            total
        }
    }

    static async getById(id: string){
        const producto = await pool.query(
            `SELECT 
                producto.id, 
                producto.nombre, 
                descripcion, 
                precio, 
                stock, 
                img_url, 
                public_id, 
                producto.created_at, 
                categoria.nombre as categoria,
                subcategoria.nombre as subcategoria,
                producto.subcategoria_id,
                json_agg(
                    json_build_object(
                        'clave', caracteristica_producto.clave,
                        'valor', caracteristica_producto.valor
                    )
                ) AS caracteristicas
            FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            LEFT JOIN subcategoria ON subcategoria.id = producto.subcategoria_id
            LEFT JOIN caracteristica_producto ON caracteristica_producto.producto_id = producto.id
            WHERE producto.id = $1
            GROUP BY producto.id, categoria.nombre, subcategoria.nombre
            `, [id]
        )

        if(producto.rows.length === 0) return null

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
            subcategoria_id,
            caracteristicas
        } = input

        try{
            // Validar subcategoría si se proporciona
            if (subcategoria_id !== undefined) {
                const subcategoriaResult = await client.query(
                    `SELECT categoria_id FROM subcategoria WHERE id = $1`,
                    [subcategoria_id]
                )

                if (subcategoriaResult.rows.length === 0) {
                    throw new Error('La subcategoría especificada no existe')
                }

                if (subcategoriaResult.rows[0].categoria_id !== categoria_id) {
                    throw new Error('La subcategoría no pertenece a la categoría especificada')
                }
            }

            await client.query(
                `BEGIN`
            )

            const result = await client.query(
                `INSERT INTO producto(nombre, descripcion, precio, stock, img_url, public_id, categoria_id, subcategoria_id)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                `, [nombre, descripcion, precio, stock, img_url, public_id, categoria_id, subcategoria_id ?? null] 
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

    static async update({ id, input}: { id: string; input: Omit<Partial<ProductoNuevo>, 'caracteristicas'>  }){
        const DATOS_PERMITIDOS = new Set(["nombre", "descripcion", "precio", "stock", "img_url", "public_id", "categoria_id", "subcategoria_id"])

        // Validar subcategoría si se proporciona
        if (input.subcategoria_id !== undefined && input.subcategoria_id !== null) {
            let catId = input.categoria_id

            if (catId === undefined) {
                const currentProduct = await pool.query(
                    `SELECT categoria_id FROM producto WHERE id = $1`, [id]
                )
                if (currentProduct.rows.length === 0) {
                    return null
                }
                catId = currentProduct.rows[0].categoria_id
            }

            const subcategoriaResult = await pool.query(
                `SELECT categoria_id FROM subcategoria WHERE id = $1`,
                [input.subcategoria_id]
            )

            if (subcategoriaResult.rows.length === 0) {
                throw new Error('La subcategoría especificada no existe')
            }

            if (subcategoriaResult.rows[0].categoria_id !== catId) {
                throw new Error('La subcategoría no pertenece a la categoría especificada')
            }
        }

        const entries = Object.entries(input).filter(
            ([key]) => DATOS_PERMITIDOS.has(key)
        )

        if (entries.length === 0) return null

        const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
        const values = entries.map(([, value]) => value)

        await pool.query(
            `UPDATE producto SET ${setClauses.join(', ')} WHERE id = $${values.length + 1}`,
            [...values, id]
        )

        const productoActualizado = await ProductosModel.getById(id)
        return productoActualizado
    }

    static async delete(id: string){
        const eliminarProducto = await pool.query(
            `DELETE FROM producto WHERE id = $1 `, [id]
        )

        // Esto nunca deberia suceder, pero typescript exige tratar este caso
        if(eliminarProducto.rowCount === null) return null

        return eliminarProducto.rowCount > 0
    }
}