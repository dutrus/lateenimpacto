"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Header from "@/components/header"
import { Calendar, BookOpen, ExternalLink, Search, Filter, ChevronDown, ChevronUp } from "lucide-react"
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

export default function Oportunidades() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tipoActivo, setTipoActivo] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(true)

  useEffect(() => {
    // Marcar como cargado después de montar el componente
    setIsLoaded(true)

    async function cargarOportunidades() {
      try {
        // Inicializar cliente de Supabase
        const supabaseUrl = "https://TU_PROYECTO.supabase.co"
        const supabaseKey = "TU_PUBLIC_ANON_KEY"
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Consultar datos
        const { data, error } = await supabase
          .from("oportunidades")
          .select("*")
          .order("fecha_limite", { ascending: true })

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

  const handleBackClick = (e) => {
    e.preventDefault()

    // Cambiar el estado para indicar que se está descargando
    setIsLoaded(false)

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  // Función para determinar el color según el tipo de oportunidad
  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase()
    if (tipoLower.includes("beca")) return "bg-blue-100 text-blue-800"
    if (tipoLower.includes("curso")) return "bg-green-100 text-green-800"
    if (tipoLower.includes("concurso") || tipoLower.includes("competencia")) return "bg-purple-100 text-purple-800"
    if (tipoLower.includes("intercambio")) return "bg-amber-100 text-amber-800"
    return "bg-gray-100 text-gray-800" // Valor por defecto
  }

  // Obtener tipos únicos para el filtro
  const tiposUnicos = Array.from(new Set(oportunidades.map((op) => op.tipo)))

  // Filtrar oportunidades según los criterios
  const filtrarOportunidades = () => {
    return oportunidades.filter((op) => {
      // Filtrar por tipo
      const coincideTipo = tipoActivo === "todos" || op.tipo === tipoActivo

      // Filtrar por búsqueda
      const coincideBusqueda =
        busqueda === "" ||
        op.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        op.descripcion.toLowerCase().includes(busqueda.toLowerCase())

      return coincideTipo && coincideBusqueda
    })
  }

  const oportunidadesFiltradas = filtrarOportunidades()

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Oportunidades Educativas</h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Explora todas las oportunidades disponibles para tu desarrollo académico y profesional.
        </p>

        {/* Buscador */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar oportunidades..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Botón para mostrar/ocultar filtros */}
        <div className="max-w-6xl mx-auto mb-6 flex justify-center">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition-colors"
          >
            <Filter size={16} />
            <span>Filtros</span>
            {mostrarFiltros ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Filtros */}
        {mostrarFiltros && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setTipoActivo("todos")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tipoActivo === "todos" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Todos los tipos
              </button>
              {tiposUnicos.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoActivo(tipo)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tipoActivo === tipo ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        <div className="max-w-6xl mx-auto mb-6">
          <p className="text-gray-600 text-center">
            {oportunidadesFiltradas.length}{" "}
            {oportunidadesFiltradas.length === 1 ? "oportunidad encontrada" : "oportunidades encontradas"}
          </p>
        </div>

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
        ) : oportunidadesFiltradas.length === 0 ? (
          // Sin resultados
          <div className="text-center py-12 bg-gray-50 rounded-lg max-w-3xl mx-auto">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">No se encontraron oportunidades con los filtros seleccionados.</p>
            <p className="text-gray-500">Intenta con otros criterios de búsqueda o elimina los filtros.</p>
          </div>
        ) : (
          // Mostrar oportunidades
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {oportunidadesFiltradas.map((oportunidad) => (
              <motion.div
                key={oportunidad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 flex flex-col h-full"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{oportunidad.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(oportunidad.tipo)}`}>
                      {oportunidad.tipo}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{oportunidad.descripcion}</p>
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
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <a
            href="/"
            onClick={handleBackClick}
            className="bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </motion.div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="relative w-[30px] h-[75px] mx-auto mb-4">
            <Image src="/icon.png" alt="Icono" fill style={{ objectFit: "contain" }} />
          </div>
          <p>© {new Date().getFullYear()} Lateen Impacto. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
