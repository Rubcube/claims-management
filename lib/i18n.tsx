"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Locale = "en" | "pt"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
}

const loadTranslations = async (locale: Locale) => {
  try {
    const response = await fetch(`/locales/${locale}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error)
    return {}
  }
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [translations, setTranslations] = useState<Record<string, any>>({})

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  useEffect(() => {
    const loadAndSetTranslations = async () => {
      const newTranslations = await loadTranslations(locale)
      setTranslations(newTranslations)
    }
    loadAndSetTranslations()
  }, [locale])

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "pt")) {
      setLocaleState(savedLocale)
    }
  }, [])

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export const useTranslation = useI18n
