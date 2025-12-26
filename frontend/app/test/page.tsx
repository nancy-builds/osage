"use client"

import { useState, useEffect } from "react"

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState<string>("Loading...")
  const [flaskStatus, setFlaskStatus] = useState<string>("Loading...")
  const [orders, setOrders] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    testAPIs()
  }, [])

  const testAPIs = async () => {
    try {
      // Test Next.js API
      console.log("[TEST] Testing Next.js API...")
      const apiResponse = await fetch("/api/orders")
      setApiStatus(`API Status: ${apiResponse.status}`)

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        setOrders(data)
        setFlaskStatus("Flask Backend: Connected ✓")
      } else {
        const errorData = await apiResponse.json()
        setError(JSON.stringify(errorData, null, 2))
        setFlaskStatus(`Flask Backend: NOT Connected ✗ - ${errorData.details || errorData.error}`)
      }
    } catch (err) {
      console.error("[TEST] Error:", err)
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
      setFlaskStatus("Flask Backend: Connection Failed ✗")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Diagnostic Test</h1>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="font-semibold text-blue-900 mb-2">Instructions:</p>
        <ol className="text-blue-800 space-y-1 list-decimal list-inside">
          <li>
            Make sure Flask backend is running: <code className="bg-blue-100 px-2 py-1">python app.py</code>
          </li>
          <li>
            Make sure you created <code className="bg-blue-100 px-2 py-1">.env.local</code> file
          </li>
          <li>Check the status below</li>
        </ol>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">Next.js API: {apiStatus}</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">{flaskStatus}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="font-semibold text-red-900">Error Details:</p>
            <pre className="text-red-800 text-sm overflow-auto mt-2">{error}</pre>
          </div>
        )}

        {orders && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="font-semibold text-green-900">Orders Retrieved:</p>
            <pre className="text-green-800 text-sm overflow-auto mt-2">{JSON.stringify(orders, null, 2)}</pre>
          </div>
        )}
      </div>

      <button
        onClick={testAPIs}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  )
}
