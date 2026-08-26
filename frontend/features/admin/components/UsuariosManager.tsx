"use client";

import { useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Calendar,
  Shield,
  ShieldAlert,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface UsuarioMock {
  id: number;
  nombre: string;
  email: string;
  rol: "ADMIN" | "CLIENTE";
  created_at: string;
  total_ordenes?: number;
}

const INITIAL_MOCK_USUARIOS: UsuarioMock[] = [
  {
    id: 1,
    nombre: "Franco Administrador",
    email: "admin@nexuspc.com",
    rol: "ADMIN",
    created_at: "2026-07-15T14:30:00.000Z",
    total_ordenes: 0,
  },
  {
    id: 2,
    nombre: "Lucas Giménez",
    email: "lucas.gimenez@gmail.com",
    rol: "CLIENTE",
    created_at: "2026-08-01T10:15:00.000Z",
    total_ordenes: 3,
  },
  {
    id: 3,
    nombre: "Camila Rodríguez",
    email: "camila.dev@hotmail.com",
    rol: "CLIENTE",
    created_at: "2026-08-10T18:40:00.000Z",
    total_ordenes: 2,
  },
  {
    id: 4,
    nombre: "Agustín Fernández",
    email: "agus.f@gmail.com",
    rol: "CLIENTE",
    created_at: "2026-08-15T12:00:00.000Z",
    total_ordenes: 1,
  },
  {
    id: 5,
    nombre: "Sofía Martínez",
    email: "sofia.mtz@yahoo.com",
    rol: "CLIENTE",
    created_at: "2026-08-20T09:25:00.000Z",
    total_ordenes: 4,
  },
  {
    id: 6,
    nombre: "Mariano Torres",
    email: "mtorres@empresa.com",
    rol: "CLIENTE",
    created_at: "2026-08-22T16:50:00.000Z",
    total_ordenes: 1,
  },
];

export function UsuariosManager() {
  const [usuarios, setUsuarios] = useState<UsuarioMock[]>(INITIAL_MOCK_USUARIOS);
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState<string>("all");
  const [userToDelete, setUserToDelete] = useState<UsuarioMock | null>(null);

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search);
    const matchesRol = filterRol === "all" || u.rol === filterRol;

    return matchesSearch && matchesRol;
  });

  const handleDelete = () => {
    if (!userToDelete) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Usuarios y Clientes
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Gestione los accesos y usuarios registrados en la tienda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filter by Rol */}
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todos los roles</option>
            <option value="CLIENTE">Solo Clientes</option>
            <option value="ADMIN">Solo Administradores</option>
          </select>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o ID..."
              className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Total Usuarios</p>
            <p className="text-xl font-extrabold text-ink">{usuarios.length}</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Clientes Activos</p>
            <p className="text-xl font-extrabold text-ink">
              {usuarios.filter((u) => u.rol === "CLIENTE").length}
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Administradores</p>
            <p className="text-xl font-extrabold text-ink">
              {usuarios.filter((u) => u.rol === "ADMIN").length}
            </p>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary w-20">
                  ID
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Usuario
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Email
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Rol
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Fecha Registro
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right w-24">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredUsuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-ink-secondary text-sm"
                  >
                    No se encontraron usuarios con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`transition-colors hover:bg-primary-tint/40 group ${
                      idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                    }`}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-ink-secondary text-xs">
                      #{String(u.id).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-ink">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-secondary font-medium">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      {u.rol === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-alt border border-border text-ink-secondary">
                          Cliente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-secondary">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-ink-secondary" />
                        {new Date(u.created_at).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.rol === "ADMIN" ? (
                        <span
                          title="No se puede eliminar la cuenta administradora principal"
                          className="p-2 text-ink-secondary/40 cursor-not-allowed inline-block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <button
                          onClick={() => setUserToDelete(u)}
                          title="Dar de baja usuario"
                          className="p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors focus:outline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
          <span>
            Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
          </span>
        </div>
      </div>

      {/* Modal Confirmación de Eliminación / Baja */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setUserToDelete(null)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 border border-border z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold text-ink">Dar de Baja Usuario</h3>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-ink-secondary">
              ¿Estás seguro de que deseas desactivar la cuenta de{" "}
              <strong className="text-ink font-semibold">
                {userToDelete.nombre}
              </strong>{" "}
              ({userToDelete.email})? El usuario no podrá iniciar sesión y se invalidarán sus tokens activos.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-border bg-surface hover:bg-surface-alt text-ink rounded-xl text-sm font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 bg-danger hover:bg-danger/90 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
