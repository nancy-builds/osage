"use client"

import { useState } from "react"
import { apiPost } from "@/lib/api"

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await apiPost<{ access_token: string }>("/login", {
        phone,
        password,
      })

      localStorage.setItem("access_token", data.access_token)
      alert("Login success")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
          <div className="pb-24 max-w-lg mx-auto">
    <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-foreground">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="tel"
          placeholder="Phone number"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    </div>
  )
}
