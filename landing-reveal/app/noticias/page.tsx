"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Header from "@/components/header"
import { Calendar, Tag, ArrowRight } from "lucide-react"
import Link from "next/link"

// Datos de noticias
const noticiasData = [
  {
    id: 1,
    titulo: "Nuevas becas disponibles para estudiar en el extranjero",
    fecha: "15 de mayo, 2025",
    categoria: "Becas",
    resumen: "Se han abierto convocatorias para becas completas en universidades de Europa y Estados Unidos.",
    contenido: `
      <p>La Fundación Internacional de Educación ha anunciado la apertura de su convocatoria anual de becas para estudios en el extranjero. Este año, se ofrecen más de 200 plazas para estudiantes latinoamericanos interesados en realizar estudios de grado y posgrado en prestigiosas universidades de Europa y Estados Unidos.</p>
      
      <p>Las becas cubren matrícula completa, alojamiento, seguro médico y un estipendio mensual para gastos de manutención. Los requisitos incluyen excelencia académica, dominio del idioma correspondiente y una carta de motivación.</p>
      
      <p>El plazo de inscripción estará abierto hasta el 30 de julio de 2025. Los interesados pueden encontrar más información en nuestra sección de becas.</p>
    `,
    link: "/oportunidades/becas",
  },
  {
    id: 2,
    titulo: "Webinar gratuito: Cómo aplicar a programas de intercambio",
    fecha: "22 de mayo, 2025",
    categoria: "Eventos",
    resumen: "Únete a nuestro webinar donde ex-becarios compartirán sus experiencias y consejos prácticos.",
    contenido: `
      <p>Te invitamos a participar en nuestro próximo webinar gratuito donde tres ex-becarios de programas internacionales compartirán sus experiencias y brindarán consejos prácticos para aplicar exitosamente a programas de intercambio.</p>
      
      <p>Durante la sesión, se abordarán temas como:</p>
      <ul>
        <li>Cómo elegir el programa adecuado según tus objetivos</li>
        <li>Tips para redactar una carta de motivación convincente</li>
        <li>Estrategias para conseguir cartas de recomendación efectivas</li>
        <li>Preparación para entrevistas en inglés</li>
        <li>Gestión del proceso de aplicación</li>
      </ul>
      
      <p>El webinar se realizará el 22 de mayo a las 18:00 (hora de Argentina) a través de Zoom. La inscripción es gratuita pero los cupos son limitados.</p>
    `,
    link: "/comunidad/ayuda",
  },
  {
    id: 3,
    titulo: "Convocatoria para voluntarios: Únete a nuestro equipo",
    fecha: "1 de junio, 2025",
    categoria: "Voluntariado",
    resumen: "Estamos buscando jóvenes comprometidos que quieran ayudar a difundir oportunidades educativas.",
    contenido: `
      <p>En Lateen Impacto estamos ampliando nuestro equipo de voluntarios y buscamos personas comprometidas con la misión de democratizar el acceso a oportunidades educativas.</p>
      
      <p>Actualmente necesitamos apoyo en las siguientes áreas:</p>
      <ul>
        <li>Investigación y difusión de oportunidades</li>
        <li>Creación de contenido para redes sociales</li>
        <li>Mentoría para aplicantes a becas</li>
        <li>Organización de eventos virtuales</li>
        <li>Traducción de convocatorias</li>
      </ul>
      
      <p>Los voluntarios dedican entre 2 y 4 horas semanales y reciben capacitación continua. Si estás interesado/a en formar parte de nuestro equipo, completa el formulario en la sección de voluntariado.</p>
    `,
    link: "/comunidad/voluntario",
  },
  {
    id: 4,
    titulo: "Nueva guía: Cómo financiar tus estudios en el exterior",
    fecha: "10 de mayo, 2025",
    categoria: "Recursos",
    resumen: "Hemos publicado una guía completa con estrategias para financiar estudios internacionales.",
    contenido: `
      <p>Estudiar en el extranjero puede parecer financieramente inalcanzable para muchos jóvenes, pero existen numerosas alternativas para hacer este sueño realidad. Por eso, hemos creado una guía completa que recopila diferentes estrategias de financiamiento.</p>
      
      <p>La guía incluye información sobre:</p>
      <ul>
        <li>Becas completas y parciales de gobiernos extranjeros</li>
        <li>Programas de financiamiento de universidades</li>
        <li>Fundaciones y organizaciones que apoyan la educación internacional</li>
        <li>Estrategias de autofinanciamiento y trabajo durante los estudios</li>
        <li>Préstamos educativos con condiciones favorables</li>
        <li>Programas de intercambio con costos reducidos</li>
      </ul>
      
      <p>Puedes descargar la guía gratuitamente desde nuestra sección de recursos.</p>
    `,
    link: "/curaduria/guias",
  },
  {
    id: 5,
    titulo: "Alianza con universidades para programas de mentoría",
    fecha: "5 de mayo, 2025",
    categoria: "Alianzas",
    resumen: "Hemos establecido acuerdos con cinco universidades para crear programas de mentoría para aspirantes.",
    contenido: `
      <p>Nos complace anunciar que Lateen Impacto ha establecido alianzas estratégicas con cinco importantes universidades de Argentina para crear programas de mentoría destinados a jóvenes que desean acceder a oportunidades educativas internacionales.</p>
      
      <p>Gracias a estos acuerdos, estudiantes y graduados de estas instituciones brindarán orientación personalizada a los aspirantes a becas y programas internacionales. Las universidades participantes son:</p>
      <ul>
        <li>Universidad de Buenos Aires</li>
        <li>Universidad Nacional de Córdoba</li>
        <li>Universidad Nacional de Rosario</li>
        <li>Universidad Nacional de Cuyo</li>
        <li>Universidad Nacional del Litoral</li>
      </ul>
      
      <p>Los interesados en recibir mentoría pueden inscribirse a través de nuestra plataforma. El programa es completamente gratuito.</p>
    `,
    link: "/comunidad/ayuda",
  },
]

export default function Noticias() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<number | null>(null)

  useEffect(() => {
    // Marcar como cargado después de montar el componente
    setIsLoaded(true)
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

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div
        id="noticias-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Novedades y Noticias</h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Mantente al día con las últimas oportunidades, eventos y recursos que ofrecemos para impulsar tu desarrollo
          educativo.
        </p>

        <div className="max-w-4xl mx-auto">
          {noticiaSeleccionada === null ? (
            // Lista de noticias
            <div className="space-y-8">
              {noticiasData.map((noticia) => (
                <motion.div
                  key={noticia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: noticia.id * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-3">
                      <div className="flex items-center text-gray-500 text-sm mb-2 md:mb-0">
                        <Calendar size={14} className="mr-1" />
                        <span>{noticia.fecha}</span>
                      </div>
                      <div className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Tag size={12} className="mr-1" />
                        <span>{noticia.categoria}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{noticia.titulo}</h2>
                    <p className="text-gray-600 mb-4">{noticia.resumen}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setNoticiaSeleccionada(noticia.id)}
                        className="text-orange-600 font-medium hover:text-orange-700 flex items-center"
                      >
                        <span>Leer completo</span>
                        <ArrowRight size={16} className="ml-1" />
                      </button>
                      <Link
                        href={noticia.link}
                        className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition-colors text-sm"
                      >
                        Ir a la sección
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Detalle de la noticia seleccionada
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {(() => {
                const noticia = noticiasData.find((n) => n.id === noticiaSeleccionada)
                if (!noticia) return null

                return (
                  <div className="p-8">
                    <div className="flex flex-wrap items-center justify-between mb-4">
                      <div className="flex items-center text-gray-500 text-sm mb-2 md:mb-0">
                        <Calendar size={14} className="mr-1" />
                        <span>{noticia.fecha}</span>
                      </div>
                      <div className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Tag size={12} className="mr-1" />
                        <span>{noticia.categoria}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{noticia.titulo}</h2>
                    <div
                      className="prose prose-orange max-w-none"
                      dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                    />
                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => setNoticiaSeleccionada(null)}
                        className="text-orange-600 font-medium hover:text-orange-700"
                      >
                        ← Volver a todas las noticias
                      </button>
                      <Link
                        href={noticia.link}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                      >
                        Ir a la sección relacionada
                      </Link>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
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
