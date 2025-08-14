"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones básicas para demostración
const translations = {
  es: {
    "nav.contact": "Contacto",
    "nav.faq": "FAQ",
    "language.switch": "English",
    "language.current": "ES",
  },
  en: {
    "nav.contact": "Contact",
    "nav.faq": "FAQ",
    "language.switch": "Español",
    "language.current": "EN",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  // Función para obtener traducciones
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // Guardar preferencia de idioma en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
    }
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
