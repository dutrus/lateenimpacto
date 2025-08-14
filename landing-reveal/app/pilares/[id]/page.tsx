"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect } from "react"
import Header from "@/components/header"

// Datos de los pilares
const pilaresData = [
  {
    id: 1,
    title: "Difusión de oportunidades",
    description: "Becas, torneos, olimpiadas, intercambios, cursos gratuitos, etc.",
    content: `
      <h3>¿Qué hacemos?</h3>
      <p>Buscamos, filtramos y compartimos oportunidades educativas y de desarrollo personal para jóvenes de todas las edades y niveles académicos.</p>
      
      <h3>Tipos de oportunidades</h3>
      <ul>
        <li><strong>Becas académicas</strong> nacionales e internacionales</li>
        <li><strong>Competencias y torneos</strong> en diversas disciplinas</li>
        <li><strong>Olimpiadas</strong> de conocimiento</li>
        <li><strong>Programas de intercambio</strong> cultural y académico</li>
        <li><strong>Cursos gratuitos</strong> en línea y presenciales</li>
        <li><strong>Talleres y seminarios</strong> de desarrollo de habilidades</li>
      </ul>
      
      <h3>Nuestro compromiso</h3>
      <p>Nos aseguramos de que cada oportunidad compartida sea verificada, relevante y accesible para nuestra comunidad.</p>
    `,
  },
  {
    id: 2,
    title: "Comunidad activa",
    description: "Jóvenes ayudando a jóvenes, con apoyo de mentores, ex-becados o voluntarios.",
    content: `
      <h3>El poder de la comunidad</h3>
      <p>Creemos firmemente en el potencial transformador de una comunidad comprometida donde los jóvenes se apoyan mutuamente en su desarrollo.</p>
      
      <h3>¿Quiénes participan?</h3>
      <ul>
        <li><strong>Jóvenes estudiantes</strong> de diversos niveles educativos</li>
        <li><strong>Mentores voluntarios</strong> con experiencia en diferentes campos</li>
        <li><strong>Ex-becarios</strong> que comparten sus experiencias y aprendizajes</li>
        <li><strong>Profesionales</strong> que donan su tiempo y conocimiento</li>
      </ul>
      
      <h3>Actividades comunitarias</h3>
      <p>Organizamos sesiones de mentoría, grupos de estudio, talleres colaborativos y espacios de networking para fortalecer los lazos entre los miembros de nuestra comunidad.</p>
    `,
  },
  {
    id: 3,
    title: "Curaduría de contenido",
    description: "Resumen de convocatorias, consejos y guías prácticas.",
    content: `
      <h3>Información clara y accesible</h3>
      <p>Transformamos información compleja en contenido claro, práctico y accionable para que los jóvenes puedan aprovechar al máximo las oportunidades disponibles.</p>
      
      <h3>Nuestros recursos</h3>
      <ul>
        <li><strong>Resúmenes de convocatorias</strong> con los puntos clave</li>
        <li><strong>Guías paso a paso</strong> para aplicar a becas y programas</li>
        <li><strong>Consejos prácticos</strong> de ex-becarios y expertos</li>
        <li><strong>Calendarios de fechas importantes</strong> para no perder oportunidades</li>
        <li><strong>Plantillas y ejemplos</strong> de documentos requeridos</li>
      </ul>
      
      <h3>Metodología</h3>
      <p>Nuestro equipo analiza cuidadosamente cada oportunidad, extrae la información más relevante y la presenta de manera estructurada y fácil de entender.</p>
    `,
  },
]

export default function PilarPage({ params }) {
  const router = useRouter()
  const pilarId = Number.parseInt(params.id)

  // Encontrar el pilar correspondiente
  const pilar = pilaresData.find((p) => p.id === pilarId)

  // Si no existe el pilar, redirigir a la página principal
  useEffect(() => {
    if (!pilar) {
      router.push("/")
    }
  }, [pilar, router])

  useEffect(() => {
    // Animación de entrada al cargar la página
    const content = document.getElementById("pilar-content")
    if (content) {
      content.style.opacity = "1"
      content.style.transform = "translateY(0)"
    }
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()

    // Aplicar una animación de salida
    const content = document.getElementById("pilar-content")
    if (content) {
      content.style.opacity = "0"
      content.style.transform = "translateY(20px)"
      content.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    }

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  // Si no hay pilar, no renderizar nada (mientras se redirige)
  if (!pilar) return null

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div id="pilar-content" initial={{ opacity: 0, y: 20 }} className="transition-all duration-500">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">{pilar.id}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{pilar.title}</h1>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-8">
              <div
                className="prose prose-orange max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: pilar.content }}
              />
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
          </div>
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
