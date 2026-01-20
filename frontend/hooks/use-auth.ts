import { useEffect, useState } from "react"

type User = {
  id: string
  email: string
  role: "RESTAURANT" | "CUSTOMER"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/profile", {
      credentials: "include", // IMPORTANT
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
