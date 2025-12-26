"use client"

import { useState } from "react"
import { apiPost } from "@/lib/api"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <RegisterForm />
    </main>
  )
}

function RegisterForm() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    full_name: "",
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
      await apiPost("/api/auth/register", form)
      alert("Register success. Please login.")
    } catch (err: any) {
      setError(err.message || "Register failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
      <h1 className="text-2xl font-semibold">Register</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input name="full_name"
        placeholder="Full name"
        className="w-full border p-2 rounded"
        value={form.full_name}
        onChange={handleChange}
      />

      <input
        name="phone"
        type="tel"
        placeholder="Phone number"
        className="w-full border p-2 rounded"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded"
        value={form.password} onChange={handleChange} required />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Register"}
      </button>
    </form>
  )
}
