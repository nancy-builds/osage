import { type NextRequest, NextResponse } from "next/server"

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward order to Flask backend
    const response = await fetch(`${FLASK_API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Flask API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      orderId: data.orderId || Date.now().toString(),
      status: "success",
    })
  } catch (error) {
    console.error("Order API error:", error)
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("[API] GET /api/orders - Connecting to Flask at:", FLASK_API_URL)

    const response = await fetch(`${FLASK_API_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[API] Flask responded with status:", response.status, response.statusText)
      throw new Error(`Flask error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[API] Successfully fetched orders:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Get orders failed:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : String(error),
        flaskUrl: FLASK_API_URL,
        hint: "Make sure Flask backend is running at: python app.py",
      },
      { status: 500 },
    )
  }
}
