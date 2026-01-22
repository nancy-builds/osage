"use client"

import Link from "next/link"
import { ChevronLeft, Sun, Moon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { AccountPageHeader } from "@/components/layout/AccountPageHeader"
import { useSettings } from "@/app/providers/SettingsProvider"

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    saveSettings,
  } = useSettings()



  return (
    <main className="min-h-screen bg-background">
      <AccountPageHeader link="/account" title="Settings" description="Customize and update your preferences"/>

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

              <Select 
                value={language} 
                onValueChange={setLanguage}
              >
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
          onClick={saveSettings}
          className="w-full py-5"
          >
          Save Changes
        </Button>
      </div>
    </main>
  )
}
