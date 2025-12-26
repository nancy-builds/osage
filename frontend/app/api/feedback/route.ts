import { type NextRequest, NextResponse } from "next/server"

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward feedback to Flask backend
    const response = await fetch(`${FLASK_API_URL}/api/feedback`, {
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
      feedbackId: data.feedbackId || Date.now().toString(),
      status: "success",
    })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
