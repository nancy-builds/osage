import { API_BASE_URL, API_TIMEOUT } from "../constants/api"

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    return await fetch(`${API_BASE_URL}/api${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(id)
  }
}
