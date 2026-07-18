import { pool } from "../config/db.js";

export class OrdenesModel{
    static async getAll(){
        const ordenes = await pool.query(
            `SELECT 
                orden.id, 
                orden.estado, 
                orden.total, 
                orden.created_at, 
                usuario.nombre AS usuario_nombre, 
                usuario.email AS usuario_gmail, 
                json_agg(
                    json_build_object(
                        'nombre', producto.nombre,
                        'cantidad' detalle_orden.cantidad,
                        'precio_unitario' detalle_orden.precio_unitario
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
}