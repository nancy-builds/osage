"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api"

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    phone: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await apiPost("/api/auth/login", form)
      router.push("/feedback") // go to feedback page
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-xl border p-8">
      <h2 className="text-3xl font-bold mb-2">Login</h2>
      <p className="text-gray-500 text-sm mb-8">
        Sign in to unlock exclusive discounts for your next meal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 text-white font-semibold transition-all hover:bg-primary/60 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

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
