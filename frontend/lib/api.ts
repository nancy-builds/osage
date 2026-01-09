export async function apiPost<T>(url: string, data: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⭐ REQUIRED FOR Flask-Login
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Something went wrong")
  }

  return res.json()
}
