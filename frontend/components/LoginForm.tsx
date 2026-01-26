"use client"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { apiFetch } from "../lib/api"
import { Button } from "../components/ui/button"
import { CircleAlert } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "../hooks/use-auth"

export default function LoginForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    phone: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/feedback"
  const { refreshUser } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError("")

  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    })

    let data: any = null
    try {
      data = await res.json()
    } catch {}

    if (!res.ok) {
      setError(data?.message || "Login failed")
      return
    }

    // ✅ SUCCESS PATH ONLY
    await refreshUser() // 🔥 MUST happen here

    // 🔥 SAFEST for Safari
    window.location.href = redirect || "/feedback"
    // ⬆️ replaces router.push

  } catch (err: any) {
    setError(err.message || "Network error. Please try again.")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="max-w-md w-full rounded-xl border p-8">
      <h2 className="text-3xl font-bold mb-2">Login</h2>
      <p className="text-gray-500 text-sm mb-8">
        Sign in to unlock exclusive discounts for your next meal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
            <CircleAlert className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Phone number
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="090 123 4567"
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-5"
        >
          {loading ? "Signing in..." : "Login"}
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary font-medium hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}
