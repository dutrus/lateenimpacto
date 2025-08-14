"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect } from "react"
import Header from "@/components/header"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { useParams } from "next/navigation"

interface MisionPageProps {
  dictionary: Dictionary
}

export default function MisionPage({ dictionary }: MisionPageProps) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || "es"

  useEffect(() => {
    // Animación de entrada al cargar la página
    const content = document.getElementById("mission-content")
    if (content) {
      content.style.opacity = "1"
      content.style.transform = "translateY(0)"
    }
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()

    // Aplicar una animación de salida
    const content = document.getElementById("mission-content")
    if (content) {
      content.style.opacity = "0"
      content.style.transform = "translateY(20px)"
      content.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    }

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push(`/${locale}`)
    }, 300)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div id="mission-content" initial={{ opacity: 0, y: 20 }} className="transition-all duration-500">
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

          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {locale === "es" ? "Nuestra Misión" : "Our Mission"}
          </h1>

          <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
            <p className="text-xl text-gray-800 text-justify leading-relaxed">
              {locale === "es"
                ? "Lateen Impacto busca democratizar el acceso a oportunidades educativas y de desarrollo personal para jóvenes, conectándolos con recursos, programas y comunidades que potencien su futuro."
                : "Lateen Impact seeks to democratize access to educational and personal development opportunities for young people, connecting them with resources, programs, and communities that enhance their future."}
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <a
              href={`/${locale}`}
              onClick={handleBackClick}
              className="bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
            >
              {dictionary.common.backToHome}
            </a>
          </div>
        </div>
      </motion.div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="relative w-[30px] h-[75px] mx-auto mb-4">
            <Image src="/icon.png" alt="Icono" fill style={{ objectFit: "contain" }} />
          </div>
          <p>
            © {new Date().getFullYear()} Lateen Impacto. {dictionary.common.footer.rights}
          </p>
        </div>
      </footer>
    </main>
  )
}
