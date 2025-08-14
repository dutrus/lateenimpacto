"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect } from "react"
import Header from "@/components/header"
import { Mail, Instagram, Twitter } from "lucide-react"

// Verificar que el componente esté exportado correctamente
export default function Contacto() {
  const router = useRouter()

  useEffect(() => {
    // Animación de entrada al cargar la página
    const content = document.getElementById("contacto-content")
    if (content) {
      content.style.opacity = "1"
      content.style.transform = "translateY(0)"
    }
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()

    // Aplicar una animación de salida
    const content = document.getElementById("contacto-content")
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

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div id="contacto-content" initial={{ opacity: 0, y: 20 }} className="transition-all duration-500">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Contacto</h1>

          <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Mail size={24} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">📧 Email</h2>
                  <a href="mailto:lateenimpacto@gmail.com" className="text-orange-600 hover:underline">
                    lateenimpacto@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Instagram size={24} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">📸 Instagram</h2>
                  <a
                    href="https://www.instagram.com/lateenimpacto/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    lateenimpacto
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Twitter size={24} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">𝕏 Twitter</h2>
                  <a
                    href="https://x.com/LateenImpacto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    LateenImpacto
                  </a>
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
