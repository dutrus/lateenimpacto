"use client"

import { useRouter, usePathname } from "next/navigation"
import { Globe } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { dictionary, locale } = useTranslations()

  if (!dictionary) return null

  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "en" : "es"

    // Redirigir a la ruta de cambio de idioma que será manejada por el middleware
    router.push(`/change-language/${newLocale}${pathname}`)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-full text-sm transition-colors"
      aria-label={`Cambiar a ${locale === "es" ? "inglés" : "español"}`}
    >
      <Globe size={14} />
      <span>{locale === "es" ? "EN" : "ES"}</span>
    </button>
  )
}
