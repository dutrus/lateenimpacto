"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect } from "react"
import Header from "@/components/header"

export default function Historia() {
  const router = useRouter()

  useEffect(() => {
    // Animación de entrada al cargar la página
    const content = document.getElementById("historia-content")
    if (content) {
      content.style.opacity = "1"
      content.style.transform = "translateY(0)"
    }
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()

    // Aplicar una animación de salida
    const content = document.getElementById("historia-content")
    if (content) {
      content.style.opacity = "0"
      content.style.transform = "translateY(20px)"
      content.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    }

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push("/mision")
    }, 300)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div id="historia-content" initial={{ opacity: 0, y: 20 }} className="transition-all duration-500">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center mb-8">
            <div className="relative w-[40px] h-[100px]">
              <Image
                src="/icon.png"
                alt="Logo Lateen Impacto"
                fill
                style={{ objectFit: "contain" }}
                className="filter brightness-0 sepia hue-rotate-[5deg] saturate-[10]"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Nuestra Historia</h1>

          <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="prose prose-orange max-w-none">
              <h2 className="text-2xl font-bold text-orange-600 mb-6">¿Cómo nació Lateen Impacto?</h2>

              <p className="mb-6">
                Lateen Impacto nació en 2019 de la experiencia personal de su fundadora, Lucía Martínez, quien durante
                su adolescencia descubrió casi por casualidad una beca que le permitió estudiar en el extranjero y
                cambió completamente su trayectoria educativa y profesional.
              </p>

              <p className="mb-6">
                Al regresar a Argentina, Lucía se dio cuenta de que muchos jóvenes con talento y potencial nunca
                llegaban a conocer las oportunidades que podrían transformar sus vidas, simplemente por falta de
                información o por no saber cómo acceder a ellas. Así surgió la idea de crear una plataforma que
                democratizara el acceso a estas oportunidades.
              </p>

              <h3 className="text-xl font-bold text-orange-700 mt-8 mb-4">Los primeros pasos</h3>

              <p className="mb-6">
                Lo que comenzó como un simple blog y una cuenta de Instagram donde Lucía compartía becas y oportunidades
                que encontraba, pronto se convirtió en una comunidad activa. Otros jóvenes que habían participado en
                programas similares comenzaron a sumarse como voluntarios, aportando su experiencia y conocimiento.
              </p>

              <p className="mb-6">
                En 2020, durante la pandemia, el proyecto dio un salto importante: la necesidad de información sobre
                oportunidades educativas virtuales creció exponencialmente, y Lateen Impacto respondió organizando
                webinars, creando guías detalladas y estableciendo un sistema de mentoría virtual.
              </p>

              <h3 className="text-xl font-bold text-orange-700 mt-8 mb-4">Crecimiento y evolución</h3>

              <p className="mb-6">
                Con el tiempo, Lateen Impacto evolucionó de ser un simple canal de difusión a convertirse en un
                ecosistema completo de apoyo para jóvenes buscando oportunidades. Desarrollamos tres pilares
                fundamentales:
              </p>

              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <strong>Difusión de oportunidades:</strong> Ampliamos nuestra cobertura para incluir no solo becas,
                  sino también competencias, programas de liderazgo, intercambios y más.
                </li>
                <li>
                  <strong>Comunidad activa:</strong> Formalizamos nuestra red de voluntarios y mentores, creando
                  espacios de intercambio y apoyo mutuo.
                </li>
                <li>
                  <strong>Curaduría de contenido:</strong> Desarrollamos recursos propios como guías, plantillas y
                  consejos prácticos para facilitar el proceso de aplicación.
                </li>
              </ul>

              <h3 className="text-xl font-bold text-orange-700 mt-8 mb-4">Impacto y resultados</h3>

              <p className="mb-6">
                Hasta la fecha, Lateen Impacto ha ayudado a más de 5,000 jóvenes a encontrar y aplicar a oportunidades
                educativas. Más de 500 de ellos han obtenido becas o han participado en programas internacionales
                gracias a la orientación y recursos proporcionados por nuestra plataforma.
              </p>

              <p className="mb-6">
                Nuestro equipo ha crecido hasta contar con más de 30 voluntarios activos en diferentes provincias de
                Argentina, y hemos establecido alianzas con universidades, fundaciones y organizaciones educativas que
                comparten nuestra misión.
              </p>

              <h3 className="text-xl font-bold text-orange-700 mt-8 mb-4">Mirando al futuro</h3>

              <p className="mb-6">
                El viaje de Lateen Impacto continúa. Nuestro objetivo es seguir expandiendo nuestro alcance, desarrollar
                herramientas tecnológicas que faciliten aún más el acceso a oportunidades, y crear programas propios que
                complementen las opciones existentes.
              </p>

              <p>
                Creemos firmemente que el acceso a la información y a las oportunidades educativas no debería depender
                del azar o de los privilegios. Con cada joven que apoyamos, estamos construyendo un futuro más
                equitativo y lleno de posibilidades para todos.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <a
              href="/mision"
              onClick={handleBackClick}
              className="bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
            >
              Volver a Misión
            </a>
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
