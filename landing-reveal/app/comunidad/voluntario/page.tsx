"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Header from "@/components/header"

export default function Voluntario() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Me gustaría ser voluntario</h1>

        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
          <div className="prose prose-orange max-w-none">
            <h2 className="text-2xl font-bold text-orange-600 mb-6">
              🤝 ¡Sé parte de Lateen Impacto como voluntario/a!
            </h2>

            <p className="mb-6">
              ¿Querés ayudar a que más jóvenes argentinos descubran y aprovechen oportunidades educativas que pueden
              cambiar sus vidas? En Lateen Impacto buscamos personas con compromiso social, pasión por la educación y
              ganas de construir comunidad.
            </p>

            <h3 className="text-xl font-bold text-orange-600 mt-8 mb-4">🌟 ¿Quiénes pueden ser voluntarios/as?</h3>

            <p className="mb-4">
              No necesitás experiencia previa, solo ganas de sumar. Estos son nuestros requisitos básicos:
            </p>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Tener 16 años o más.</li>
              <li>Vivir en Argentina (o estar comprometido/a con la educación de jóvenes argentinos).</li>
              <li>Contar con conexión a internet y herramientas digitales básicas.</li>
              <li>Poder dedicar al menos 2-4 horas semanales.</li>
              <li>Compartir valores como empatía, inclusión, equidad y compromiso.</li>
            </ul>

            <p className="mb-6">
              Si además te interesa o tenés experiencia en áreas como investigación, comunicación, diseño, organización
              de eventos o redes sociales, ¡mejor todavía!
            </p>

            <h3 className="text-xl font-bold text-orange-600 mt-8 mb-4">📜 Términos y condiciones del voluntariado</h3>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Este es un rol voluntario, no remunerado, y no genera una relación laboral ni contractual.</li>
              <li>Cuidamos la confidencialidad de la información que circula dentro del equipo.</li>
              <li>
                Fomentamos un ambiente seguro, colaborativo y sin discriminación. No se tolerarán actitudes violentas o
                irrespetuosas.
              </li>
              <li>
                Los contenidos creados en equipo pueden ser utilizados por Lateen Impacto con fines educativos o de
                difusión, reconociendo autoría cuando corresponda.
              </li>
              <li>Podés finalizar tu participación en cualquier momento, avisando con tiempo.</li>
              <li>
                Nos reservamos el derecho de interrumpir la participación si se incumplen estas condiciones o se afecta
                el bienestar del equipo.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-orange-600 mt-8 mb-4">✍️ ¿Te interesa sumarte?</h3>

            <p className="mb-6">Completá este formulario y te vamos a contactar lo antes posible:</p>

            <div className="flex justify-center mt-6 mb-4">
              <a
                href="#"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center"
              >
                👉 Quiero ser voluntario/a
              </a>
            </div>
          </div>
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
