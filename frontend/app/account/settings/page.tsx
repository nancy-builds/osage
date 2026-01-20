"use client"

import Link from "next/link"
import { SectionHeader } from "@/components/account/section-header"
import { useState, useEffect } from "react"
import { ChevronLeft, Sun, Moon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [language, setLanguage] = useState("en")
  
  const handleSave = () => {
    const settings = {
      theme,
      language,
    }

    localStorage.setItem("settings", JSON.stringify(settings))
    alert("Settings saved successfully!")
  }
  useEffect(() => {
    const saved = localStorage.getItem("settings")
    if (!saved) return

    const parsed = JSON.parse(saved)

    if (parsed.theme) setTheme(parsed.theme)
    if (parsed.language) setLanguage(parsed.language)
  }, [])


  useEffect(() => {
  const root = document.documentElement

  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}, [theme])




  return (
    <main className="min-h-screen bg-background">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link href="/account" className="text-accent hover:opacity-80">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">

        <div className="bg-card border border-border rounded-lg">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "light" ? (
                  <Sun className="text-accent" />
                ) : (
                  <Moon className="text-accent" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {theme === "light" ? "Bright and clean appearance" : "Easy on the eyes"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "dark" ? "bg-accent" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

                
        <div className="bg-card border border-border rounded-lg">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-accent" />
                <div>
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-xs text-muted-foreground">
                    Choose the language for the interface
                  </p>
                </div>
              </div>

              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="px-5 py-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </div>


        <Button
          onClick={handleSave}
          className="w-full py-5"
          >
          Save Changes
        </Button>
      </div>
    </main>
  )
}
