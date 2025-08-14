"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import { Bell, Calendar, ArrowRight } from "lucide-react"
// Importar el nuevo componente al principio del archivo
// import OportunidadesEducativas from "@/components/oportunidades-educativas"

export default function Home() {
  const router = useRouter()

  const handlePilarClick = (id) => {
    // Aplicar una animación de salida
    const content = document.getElementById("main-content")
    if (content) {
      content.style.opacity = "0"
      content.style.transform = "translateY(20px)"
      content.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    }

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push(`/pilares/${id}`)
    }, 300)
  }

  // Datos de noticias importantes
  const noticias = [
    {
      id: 1,
      titulo: "Nuevas becas disponibles para estudiar en el extranjero",
      fecha: "15 de mayo, 2025",
      resumen: "Se han abierto convocatorias para becas completas en universidades de Europa y Estados Unidos.",
      link: "/oportunidades/becas",
    },
    {
      id: 2,
      titulo: "Webinar gratuito: Cómo aplicar a programas de intercambio",
      fecha: "22 de mayo, 2025",
      resumen: "Únete a nuestro webinar donde ex-becarios compartirán sus experiencias y consejos prácticos.",
      link: "/comunidad/ayuda",
    },
    {
      id: 3,
      titulo: "Convocatoria para voluntarios: Únete a nuestro equipo",
      fecha: "1 de junio, 2025",
      resumen: "Estamos buscando jóvenes comprometidos que quieran ayudar a difundir oportunidades educativas.",
      link: "/comunidad/voluntario",
    },
  ]

  const pilares = [
    {
      id: 1,
      title: "Difusión de oportunidades",
      description: "Becas, torneos, olimpiadas, intercambios, cursos gratuitos, etc.",
    },
    {
      id: 2,
      title: "Comunidad activa",
      description: "Jóvenes ayudando a jóvenes, con apoyo de mentores, ex-becados o voluntarios.",
    },
    {
      id: 3,
      title: "Curaduría de contenido",
      description: "Resumen de convocatorias, consejos y guías prácticas.",
    },
  ]

  return (
    <main className="min-h-screen relative">
      {/* Header con menú */}
      <Header />

      {/* Contenido de la landing page */}
      <motion.div
        id="main-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="transition-all duration-500"
      >
        <section className="bg-gradient-to-b from-orange-500 to-orange-600 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-[60px] h-[150px] mb-8">
                <Image src="/icon.png" alt="Icono" fill style={{ objectFit: "contain" }} />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Lateen Impacto</h1>
              <p className="text-xl text-white/90 max-w-2xl mb-8">
                No todos tenemos las mismas oportunidades. Pero todos tenemos más oportunidades de las que creemos.
              </p>
              <Link
                href="/mision"
                className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-orange-100 transition-colors"
              >
                Misión
              </Link>
            </div>
          </div>
        </section>

        {/* Nueva sección de Novedades */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-10">
              <Bell size={24} className="text-orange-500 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-center">Novedades importantes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {noticias.map((noticia) => (
                <motion.div
                  key={noticia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: noticia.id * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar size={14} className="mr-1" />
                      <span>{noticia.fecha}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{noticia.titulo}</h3>
                    <p className="text-gray-600 mb-4">{noticia.resumen}</p>
                    <Link
                      href={noticia.link}
                      className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                    >
                      <span>Leer más</span>
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="/noticias"
                className="bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
              >
                Ver todas las novedades
              </Link>
            </div>
          </div>
        </section>

        {/* Sección de Oportunidades Educativas */}
        {/* <OportunidadesEducativas /> */}

        <section id="pilares-section" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pilares del proyecto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pilares.map((pilar) => (
                <div
                  key={pilar.id}
                  className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full mb-6 flex items-center justify-center">
                    <span className="text-white font-bold">{pilar.id}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{pilar.title}</h3>
                  <p className="text-gray-600 mb-6">{pilar.description}</p>
                  <button
                    onClick={() => handlePilarClick(pilar.id)}
                    className="mt-auto bg-orange-500 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    ¡Quiero saber más!
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="relative w-[30px] h-[75px] mx-auto mb-4">
              <Image src="/icon.png" alt="Icono" fill style={{ objectFit: "contain" }} />
            </div>
            <p>© {new Date().getFullYear()} Lateen Impacto. Todos los derechos reservados.</p>
          </div>
        </footer>
      </motion.div>
    </main>
  )
}
