import { Producto } from '@/features/productos/types/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CarritoContextType, CarritoItem } from '../types/carrito'

export const useCarritoStore = create<CarritoContextType>()(
    persist(
        (set) => ({
            items: [],
            total: 0,
            totalItems: 0,
            agregarProducto: (producto: Producto, cantidad: number) => set((state) => {
                const itemExistente = state.items.find((item) => item.id === producto.id)
                let nuevosItems: CarritoItem[]

                if (itemExistente) {
                    nuevosItems = state.items.map((item) => {
                        if (item.id === producto.id) {
                            const nuevaCantidad = Math.min(item.cantidad + cantidad, item.stock)
                            return {
                                ...item,
                                cantidad: nuevaCantidad
                            }
                        }
                        return item
                    })
                } else {
                    const nuevoItem: CarritoItem = {
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: Number(producto.precio),
                        precio_oferta: producto.precio_oferta != null ? Number(producto.precio_oferta) : null,
                        img_url: producto.img_url,
                        stock: producto.stock,
                        cantidad: Math.min(cantidad, producto.stock)
                    }
                    nuevosItems = [...state.items, nuevoItem]
                }

                const totalItems = nuevosItems.reduce((acc, item) => acc + item.cantidad, 0)
                const total = nuevosItems.reduce((acc, item) => {
                    const precioEfectivo = item.precio_oferta ?? item.precio
                    return acc + Number(precioEfectivo) * item.cantidad
                }, 0)

                return {
                    items: nuevosItems,
                    totalItems,
                    total
                }
            }),
            eliminarProducto: (id: string) => set((state) => {
                const nuevosItems = state.items.filter((item) => item.id !== id)
                const totalItems = nuevosItems.reduce((acc, item) => acc + item.cantidad, 0)
                const total = nuevosItems.reduce((acc, item) => {
                    const precioEfectivo = item.precio_oferta ?? item.precio
                    return acc + Number(precioEfectivo) * item.cantidad
                }, 0)

                return {
                    items: nuevosItems,
                    totalItems,
                    total
                }
            }),
            actualizarCantidad: (id: string, cantidad: number) => set((state) => {
                const nuevosItems = state.items.map((item) => {
                    if (item.id === id) {
                        const nuevaCantidad = Math.max(1, Math.min(cantidad, item.stock))
                        return {
                            ...item,
                            cantidad: nuevaCantidad
                        }
                    }
                    return item
                })
                const totalItems = nuevosItems.reduce((acc, item) => acc + item.cantidad, 0)
                const total = nuevosItems.reduce((acc, item) => {
                    const precioEfectivo = item.precio_oferta ?? item.precio
                    return acc + Number(precioEfectivo) * item.cantidad
                }, 0)

                return {
                    items: nuevosItems,
                    totalItems,
                    total
                }
            }),
            limpiarCarrito: () => set({ items: [], total: 0, totalItems: 0 })
        }),
    {
        name: 'carrito'
    }
    )
)