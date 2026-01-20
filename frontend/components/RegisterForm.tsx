"use client"

import { useState } from "react"
import { apiPost } from "@/lib/api"
import { CircleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { ro } from "date-fns/locale"
import { Button } from "@/components/ui/button"


export default function RegisterForm() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    full_name: "",
    role: "customer",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate phone
    const phoneRegex = /^\+?\d{10,15}$/
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid phone number")
      setLoading(false)
      return
    }

    setError("")

    try {
      await apiPost("/api/auth/register", form)
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Register failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-xl border p-8">
      <h2 className="text-3xl font-bold mb-2">Register</h2>
      <p className="text-gray-500 text-sm mb-8">
        Browse and order without signing in. Create an account to share feedback and earn special discounts.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Error */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
            <CircleAlert className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full name
          </label>
          <input
            name="full_name"
            placeholder="Your full name"
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>

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
          <input name="password" type="password" placeholder="Enter your password"
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.password} onChange={handleChange} required />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>
          <input
            name="role"
            placeholder="customer or restaurant"
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.role}
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
          {loading ? "Creating account..." : "Register"}
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Login
          </a>
        </p>

      </form>
    </div>
  )
}
