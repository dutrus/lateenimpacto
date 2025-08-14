"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { useParams } from "next/navigation"

interface HomePageProps {
  dictionary: Dictionary
}

export default function HomePage({ dictionary }: HomePageProps) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || "es"

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
      router.push(`/${locale}/pilares/${id}`)
    }, 300)
  }

  const pilares = [
    {
      id: 1,
      title: dictionary.home.pillars.opportunities.title,
      description: dictionary.home.pillars.opportunities.description,
      button: dictionary.home.pillars.opportunities.button,
    },
    {
      id: 2,
      title: dictionary.home.pillars.community.title,
      description: dictionary.home.pillars.community.description,
      button: dictionary.home.pillars.community.button,
    },
    {
      id: 3,
      title: dictionary.home.pillars.curation.title,
      description: dictionary.home.pillars.curation.description,
      button: dictionary.home.pillars.curation.button,
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
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{dictionary.home.title}</h1>
              <p className="text-xl text-white/90 max-w-2xl mb-8">{dictionary.home.subtitle}</p>
              <Link
                href={`/${locale}/mision`}
                className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-orange-100 transition-colors"
              >
                {dictionary.home.mission}
              </Link>
            </div>
          </div>
        </section>

        <section id="pilares-section" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{dictionary.home.pillars.title}</h2>
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
                    {pilar.button}
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
            <p>
              © {new Date().getFullYear()} Lateen Impacto. {dictionary.common.footer.rights}
            </p>
          </div>
        </footer>
      </motion.div>
    </main>
  )
}
