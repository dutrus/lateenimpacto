"use client"

import { useEffect, useState } from "react"
import { Calendar, BookOpen, ExternalLink } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Tipo para las oportunidades
interface Oportunidad {
  id: number
  titulo: string
  descripcion: string
  fecha_limite: string
  tipo: string
  enlace: string
}

export default function OportunidadesEducativas() {
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarOportunidades() {
      try {
        // Inicializar cliente de Supabase
        // Nota: En producción, estas credenciales deberían estar en variables de entorno
        const supabaseUrl = "https://TU_PROYECTO.supabase.co"
        const supabaseKey = "TU_PUBLIC_ANON_KEY"
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Consultar datos
        const { data, error } = await supabase
          .from("oportunidades")
          .select("*")
          .order("fecha_limite", { ascending: true })
          .limit(6) // Limitamos a 6 oportunidades para la página principal

        if (error) throw error

        setOportunidades(data || [])
      } catch (err) {
        console.error("Error al cargar oportunidades:", err)
        setError("No se pudieron cargar las oportunidades. Por favor, intenta más tarde.")
      } finally {
        setCargando(false)
      }
    }

    cargarOportunidades()
  }, [])

  // Función para determinar el color según el tipo de oportunidad
  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase()
    if (tipoLower.includes("beca")) return "bg-blue-100 text-blue-800"
    if (tipoLower.includes("curso")) return "bg-green-100 text-green-800"
    if (tipoLower.includes("concurso") || tipoLower.includes("competencia")) return "bg-purple-100 text-purple-800"
    if (tipoLower.includes("intercambio")) return "bg-amber-100 text-amber-800"
    return "bg-gray-100 text-gray-800" // Valor por defecto
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Oportunidades Educativas</h2>

        {cargando ? (
          // Estado de carga
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          // Estado de error
          <div className="text-center py-8 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : oportunidades.length === 0 ? (
          // Sin resultados
          <div className="text-center py-8">
            <p className="text-gray-600">No hay oportunidades disponibles en este momento.</p>
          </div>
        ) : (
          // Mostrar oportunidades
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {oportunidades.map((oportunidad) => (
              <div
                key={oportunidad.id}
                className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 flex flex-col h-full"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{oportunidad.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(oportunidad.tipo)}`}>
                      {oportunidad.tipo}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">{oportunidad.descripcion}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar size={16} className="mr-2 text-orange-500" />
                    <span>
                      <strong>Fecha límite:</strong> {oportunidad.fecha_limite}
                    </span>
                  </div>
                </div>
                <a
                  href={oportunidad.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full"
                >
                  <span>Ver más</span>
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <a
            href="/oportunidades"
            className="bg-white border-2 border-orange-500 text-orange-600 font-medium py-2 px-6 rounded-full hover:bg-orange-50 transition-colors flex items-center"
          >
            <BookOpen size={18} className="mr-2" />
            <span>Ver todas las oportunidades</span>
          </a>
        </div>
      </div>
    </section>
  )
}
