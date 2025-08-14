"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Header from "@/components/header"
import Link from "next/link"

export default function Ayuda() {
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
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Necesito ayuda</h1>

        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
          <div className="prose prose-orange max-w-none">
            <h2 className="text-2xl font-bold text-orange-600 mb-6">❓ ¿Necesitás ayuda?</h2>

            <p className="mb-8">
              Sabemos que buscar oportunidades puede ser abrumador. Por eso, en Lateen Impacto queremos acompañarte en
              cada paso. Elegí la opción que mejor se adapte a lo que necesitás:
            </p>

            <div className="space-y-10">
              {/* Opción 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-orange-600 mb-3">📚 Quiero encontrar oportunidades</h3>
                <p className="mb-4">Te ayudamos a descubrir becas, concursos, olimpiadas, intercambios y más.</p>
                <div className="mt-4">
                  <Link
                    href="/oportunidades/becas"
                    className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                  >
                    👉 Explorar oportunidades
                  </Link>
                </div>
              </div>

              {/* Opción 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-orange-600 mb-3">🤔 No sé por dónde empezar</h3>
                <p className="mb-4">¿Te sentís perdido/a? Completá este formulario y te guiamos paso a paso.</p>
                <div className="mt-4">
                  <Link
                    href="/comunidad/orientacion"
                    className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                  >
                    👉 Necesito orientación personalizada
                  </Link>
                </div>
              </div>

              {/* Opción 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-orange-600 mb-3">💬 Quiero hablar con alguien del equipo</h3>
                <p className="mb-4">
                  Podés contactarnos por redes sociales o email, o pedir una llamada breve para resolver tus dudas.
                </p>
                <div className="mt-4">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                  >
                    👉 Contactar al equipo
                  </Link>
                </div>
              </div>

              {/* Opción 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-orange-600 mb-3">💡 Tengo una duda puntual</h3>
                <p className="mb-4">Revisá nuestras preguntas frecuentes o escribinos directamente.</p>
                <div className="mt-4 space-y-2">
                  <div>
                    <Link
                      href="/faq"
                      className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                    >
                      👉 Preguntas frecuentes
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                    >
                      👉 Enviar mensaje
                    </Link>
                  </div>
                </div>
              </div>
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
