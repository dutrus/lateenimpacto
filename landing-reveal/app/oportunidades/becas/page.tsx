"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Header from "@/components/header"
import { Calendar, GraduationCap, Globe, ArrowRight, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"

// Tipo para las becas
interface Beca {
  id: number
  titulo: string
  descripcion: string
  fecha_limite: string
  pais: string
  nivel: string
  area: string
  financiamiento: string
  requisitos: string[]
  link: string
}

// Colores para cada nivel
const coloresNivel = {
  Secundario: "bg-blue-100 text-blue-800",
  Universitario: "bg-purple-100 text-purple-800",
  Grado: "bg-green-100 text-green-800",
  Posgrado: "bg-amber-100 text-amber-800",
}

export default function Becas() {
  const router = useRouter()
  const [nivelActivo, setNivelActivo] = useState("todos")
  const [areaActiva, setAreaActiva] = useState("todas")
  const [isLoaded, setIsLoaded] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(true)
  const [becas, setBecas] = useState<Beca[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Marcar como cargado después de montar el componente
    setIsLoaded(true)

    // Cargar becas desde Supabase
    async function cargarBecas() {
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase.from("becas").select("*").order("fecha_limite", { ascending: true })

        if (error) throw error

        setBecas(data || [])
      } catch (err) {
        console.error("Error al cargar becas:", err)
        setError("No se pudieron cargar las becas. Por favor, intenta más tarde.")
      } finally {
        setCargando(false)
      }
    }

    cargarBecas()
  }, [])

  // Agrupar becas por nivel
  const becasPorNivel = {
    Secundario: becas.filter((beca) => beca.nivel === "Secundario"),
    Universitario: becas.filter((beca) => beca.nivel === "Universitario"),
    Grado: becas.filter((beca) => beca.nivel === "Grado"),
    Posgrado: becas.filter((beca) => beca.nivel === "Posgrado"),
  }

  // Orden de visualización de los niveles
  const ordenNiveles = ["Secundario", "Universitario", "Grado", "Posgrado"]

  // Extraer áreas únicas de las becas
  const areasUnicas = Array.from(new Set(becas.map((beca) => beca.area)))

  const handleBackClick = (e) => {
    e.preventDefault()

    // Cambiar el estado para indicar que se está descargando
    setIsLoaded(false)

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  // Función para cambiar nivel con animación
  const cambiarNivel = (nivel) => {
    // Establece el nuevo nivel activo sin animaciones de salida
    setNivelActivo(nivel)
  }

  // Función para cambiar área con animación
  const cambiarArea = (area) => {
    // Establece la nueva área activa sin animaciones de salida
    setAreaActiva(area)
  }

  // Obtener las becas a mostrar según los filtros activos
  const getBecasFiltradas = () => {
    let becasFiltradas = becas

    // Filtrar por nivel si no es "todos"
    if (nivelActivo !== "todos") {
      becasFiltradas = becasFiltradas.filter((beca) => beca.nivel === nivelActivo)
    }

    // Filtrar por área si no es "todas"
    if (areaActiva !== "todas") {
      becasFiltradas = becasFiltradas.filter((beca) => beca.area === areaActiva)
    }

    return becasFiltradas
  }

  // Renderizar una beca individual
  const renderBeca = (beca) => (
    <motion.div
      key={beca.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{beca.titulo}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${coloresNivel[beca.nivel]}`}>{beca.nivel}</span>
        </div>
        <p className="text-gray-700 mb-4">{beca.descripcion}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-orange-500" />
            <span>
              <strong>Fecha límite:</strong> {beca.fecha_limite}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe size={18} className="text-orange-500" />
            <span>
              <strong>País:</strong> {beca.pais}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <GraduationCap size={18} className="text-orange-500" />
            <span>
              <strong>Área:</strong> {beca.area}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-bold text-gray-900 mb-2">Financiamiento</h4>
          <p className="text-gray-700">{beca.financiamiento}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-2">Requisitos</h4>
          <ul className="list-disc pl-5 space-y-1">
            {beca.requisitos.map((requisito, index) => (
              <li key={index} className="text-gray-700">
                {requisito}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={beca.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          <span>Más información</span>
          <ArrowRight size={16} />
        </a>
      </div>
    </motion.div>
  )

  const becasFiltradas = getBecasFiltradas()

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
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Becas</h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Descubre oportunidades de becas nacionales e internacionales para continuar tu formación académica.
        </p>

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

        {/* Sección de filtros */}
        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="max-w-6xl mx-auto mb-12">
                {/* Filtro por nivel */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-center">Nivel académico</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => cambiarNivel("todos")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                        nivelActivo === "todos"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Todos los niveles
                    </button>
                    {ordenNiveles.map((nivel) => (
                      <button
                        key={nivel}
                        onClick={() => cambiarNivel(nivel)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                          nivelActivo === nivel
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {nivel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro por área */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-center">Área de estudio</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => cambiarArea("todas")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                        areaActiva === "todas"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Todas las áreas
                    </button>
                    {areasUnicas.map((area) => (
                      <button
                        key={area}
                        onClick={() => cambiarArea(area)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                          areaActiva === area
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contador de resultados */}
        <div className="max-w-6xl mx-auto mb-6">
          <p className="text-gray-600 text-center">
            {becasFiltradas.length} {becasFiltradas.length === 1 ? "beca encontrada" : "becas encontradas"}
          </p>
        </div>

        {/* Listado de becas */}
        <div className="max-w-6xl mx-auto">
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
          ) : becasFiltradas.length === 0 ? (
            // Sin resultados
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No se encontraron becas con los filtros seleccionados.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {nivelActivo === "todos" && areaActiva === "todas" ? (
                // Mostrar todos los niveles agrupados cuando no hay filtros
                <motion.div
                  key="todos-niveles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {ordenNiveles.map(
                    (nivel) =>
                      becasPorNivel[nivel].length > 0 && (
                        <div key={nivel} className="mb-16">
                          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                            Becas para nivel {nivel}
                          </h2>
                          <div className="space-y-8">{becasPorNivel[nivel].map(renderBeca)}</div>
                        </div>
                      ),
                  )}
                </motion.div>
              ) : (
                // Mostrar becas filtradas
                <motion.div
                  key={`${nivelActivo}-${areaActiva}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">{becasFiltradas.map(renderBeca)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

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
