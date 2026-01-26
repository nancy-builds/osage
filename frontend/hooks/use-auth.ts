import { useEffect, useState, useCallback } from "react"
import { API_BASE_URL } from "../constants/api"

type User = {
  id: string
  role: "RESTAURANT" | "CUSTOMER"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        credentials: "include",
      })

      if (!res.ok) {
        setUser(null)
        return
      }

      const data = await res.json()
      setUser(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    user,
    loading,
    refreshUser: fetchProfile, // 🔥 KEY
  }
}
