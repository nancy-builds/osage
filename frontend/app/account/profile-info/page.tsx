"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"


type ProfileForm = {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
}

export default function ProfileInfoPage() {
  const [formData, setFormData] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
  const res = await fetch("http://localhost:5000/api/auth/profile-info", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // IMPORTANT if using session auth
    body: JSON.stringify(formData),
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || "Failed to update profile")
    return
  }

  alert("Profile information saved!")
}


  return (
    <main className="min-h-screen bg-background">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link href="/account" className="text-accent hover:opacity-80">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Profile Information</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full mt-6 py-5"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </main>
  )
}
