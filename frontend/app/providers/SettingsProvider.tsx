"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type SettingsContextType = {
  theme: Theme
  setTheme: (t: Theme) => void
  language: string
  setLanguage: (l: string) => void
  saveSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [language, setLanguage] = useState("en")

  // Load from localStorage ONCE
  useEffect(() => {
    const saved = localStorage.getItem("settings")
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      if (parsed.theme) setTheme(parsed.theme)
      if (parsed.language) setLanguage(parsed.language)
    } catch {}
  }, [])

  // Apply theme globally
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
  }, [theme])

  const saveSettings = () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ theme, language })
    )
    alert("Settings saved successfully!")

  }

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error("useSettings must be used inside SettingsProvider")
  }
  return ctx
}
