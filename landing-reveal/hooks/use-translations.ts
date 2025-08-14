"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import type { Dictionary } from "@/lib/i18n/dictionaries"

// Hook para usar traducciones en componentes del cliente
export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as string) || "es"
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDictionary() {
      try {
        setLoading(true)
        const response = await fetch(`/api/i18n?locale=${locale}`)
        const data = await response.json()
        setDictionary(data)
      } catch (error) {
        console.error("Error loading translations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, [locale])

  return { dictionary, loading, locale }
}
