"use client";

import { useState } from "react";
import { User, Mail, IdCard, MapPin, Building, Home, Hash, Save } from "lucide-react";

const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires (CABA)",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export function MisDatosForm() {
  // Datos Bloqueados (No editables)
  const datosBloqueados = {
    nombre: "Julián",
    dni: "42.123.456",
    email: "julian.v@gmail.com",
  };

  // Datos Editables
  const [editableData, setEditableData] = useState({
    provincia: "Buenos Aires",
    nombreCompleto: "Julián Velásquez",
    direccion: "Av. Corrientes 1234, 4° B",
    ciudad: "Ciudad Autónoma de Buenos Aires",
    codigoPostal: "C1043",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Título de la Sección */}
      <div className="pb-6 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Mis Datos Personales
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Información de tu cuenta y datos de envío de pedidos
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm font-bold animate-fade-in flex items-center gap-2">
          <span>✓ ¡Datos guardados correctamente!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── BLOQUE DE INPUTS ──────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Nombre (Bloqueado) */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-ink">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary/60" />
              <input
                type="text"
                value={datosBloqueados.nombre}
                disabled
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-border/70 rounded-xl text-sm font-medium text-ink-secondary cursor-not-allowed select-none opacity-75"
              />
            </div>
          </div>

          {/* 2. DNI (Bloqueado) */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-ink">
              DNI / Documento
            </label>
            <div className="relative">
              <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary/60" />
              <input
                type="text"
                value={datosBloqueados.dni}
                disabled
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-border/70 rounded-xl text-sm font-medium text-ink-secondary cursor-not-allowed select-none opacity-75"
              />
            </div>
          </div>

          {/* 3. Gmail (Bloqueado - Ancho Completo) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-ink">
              Gmail / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary/60" />
              <input
                type="email"
                value={datosBloqueados.email}
                disabled
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-border/70 rounded-xl text-sm font-medium text-ink-secondary cursor-not-allowed select-none opacity-75"
              />
            </div>
          </div>

          {/* 4. Nombre Completo (Editable) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="nombreCompleto" className="block text-xs sm:text-sm font-bold text-ink">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="nombreCompleto"
                type="text"
                value={editableData.nombreCompleto}
                onChange={(e) => setEditableData({ ...editableData, nombreCompleto: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Tu nombre y apellido completo"
              />
            </div>
          </div>

          {/* 5. Provincia (Editable) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="provincia" className="block text-xs sm:text-sm font-bold text-ink">
              Provincia
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <select
                id="provincia"
                value={editableData.provincia}
                onChange={(e) => setEditableData({ ...editableData, provincia: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                {PROVINCIAS_ARGENTINA.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Dirección (Editable) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="direccion" className="block text-xs sm:text-sm font-bold text-ink">
              Dirección
            </label>
            <div className="relative">
              <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="direccion"
                type="text"
                value={editableData.direccion}
                onChange={(e) => setEditableData({ ...editableData, direccion: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Ej: Av. Corrientes 1234, Piso 4 B"
              />
            </div>
          </div>

          {/* 7. Ciudad (Editable) */}
          <div className="space-y-1.5">
            <label htmlFor="ciudad" className="block text-xs sm:text-sm font-bold text-ink">
              Ciudad
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="ciudad"
                type="text"
                value={editableData.ciudad}
                onChange={(e) => setEditableData({ ...editableData, ciudad: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Tu ciudad"
              />
            </div>
          </div>

          {/* 8. Código Postal (Editable) */}
          <div className="space-y-1.5">
            <label htmlFor="codigoPostal" className="block text-xs sm:text-sm font-bold text-ink">
              Código Postal
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="codigoPostal"
                type="text"
                value={editableData.codigoPostal}
                onChange={(e) => setEditableData({ ...editableData, codigoPostal: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Ej: C1043"
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="pt-4 flex justify-end border-t border-border/50">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-surface font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
}
