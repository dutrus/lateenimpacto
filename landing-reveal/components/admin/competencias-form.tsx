"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@/lib/supabase"

export default function CompetenciasForm() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_proxima: "",
    nivel: "",
    area: "",
    ubicacion: "",
    modalidad: "",
    requisitos: [""],
    proceso: "",
    link: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequisitosChange = (index: number, value: string) => {
    const newRequisitos = [...formData.requisitos]
    newRequisitos[index] = value
    setFormData((prev) => ({ ...prev, requisitos: newRequisitos }))
  }

  const addRequisitoField = () => {
    setFormData((prev) => ({ ...prev, requisitos: [...prev.requisitos, ""] }))
  }

  const removeRequisitoField = (index: number) => {
    if (formData.requisitos.length > 1) {
      const newRequisitos = [...formData.requisitos]
      newRequisitos.splice(index, 1)
      setFormData((prev) => ({ ...prev, requisitos: newRequisitos }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      // Filtrar requisitos vacíos
      const requisitosFiltered = formData.requisitos.filter((req) => req.trim() !== "")

      const supabase = createClientComponentClient()
      const { error } = await supabase.from("competencias").insert([{ ...formData, requisitos: requisitosFiltered }])

      if (error) throw error

      setMessage({ text: "Competencia agregada exitosamente", type: "success" })
      // Resetear el formulario
      setFormData({
        titulo: "",
        descripcion: "",
        fecha_proxima: "",
        nivel: "",
        area: "",
        ubicacion: "",
        modalidad: "",
        requisitos: [""],
        proceso: "",
        link: "",
      })
    } catch (error) {
      console.error("Error al agregar competencia:", error)
      setMessage({ text: "Error al agregar competencia. Intenta nuevamente.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div
          className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="titulo" className="text-sm font-medium">
            Título *
          </label>
          <input
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fecha_proxima" className="text-sm font-medium">
            Fecha Próxima *
          </label>
          <input
            id="fecha_proxima"
            name="fecha_proxima"
            value={formData.fecha_proxima}
            onChange={handleChange}
            placeholder="Ej: Julio 2025"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="nivel" className="text-sm font-medium">
            Nivel *
          </label>
          <select
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecciona un nivel</option>
            <option value="Secundario">Secundario</option>
            <option value="Universitario">Universitario</option>
            <option value="Grado">Grado</option>
            <option value="Posgrado">Posgrado</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="area" className="text-sm font-medium">
            Área *
          </label>
          <input
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Ej: Matemáticas, Física, Informática"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ubicacion" className="text-sm font-medium">
            Ubicación *
          </label>
          <input
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Internacional (sede por confirmar)"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="modalidad" className="text-sm font-medium">
            Modalidad *
          </label>
          <select
            id="modalidad"
            name="modalidad"
            value={formData.modalidad}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecciona una modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrida">Híbrida</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="link" className="text-sm font-medium">
            Enlace *
          </label>
          <input
            id="link"
            name="link"
            type="url"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="text-sm font-medium">
          Descripción *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="proceso" className="text-sm font-medium">
          Proceso de Selección *
        </label>
        <textarea
          id="proceso"
          name="proceso"
          value={formData.proceso}
          onChange={handleChange}
          rows={2}
          placeholder="Ej: Instancia escolar → Provincial → Nacional → Internacional"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Requisitos *</label>
        {formData.requisitos.map((requisito, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={requisito}
              onChange={(e) => handleRequisitosChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder={`Requisito ${index + 1}`}
              required
            />
            <button
              type="button"
              onClick={() => removeRequisitoField(index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              disabled={formData.requisitos.length <= 1}
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRequisitoField}
          className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
        >
          + Agregar requisito
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-70"
      >
        {loading ? "Guardando..." : "Guardar Competencia"}
      </button>
    </form>
  )
}
