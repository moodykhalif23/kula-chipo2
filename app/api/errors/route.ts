import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()

    // Log the error (in production, you'd send this to your error tracking service)
    console.error("Client error reported:", {
      timestamp: errorData.timestamp,
      message: errorData.message,
      url: errorData.url,
      userAgent: errorData.userAgent,
      type: errorData.type,
      isChunkError: errorData.isChunkError,
      isImportError: errorData.isImportError,
      retryCount: errorData.retryCount,
    })

    // In production, you would send this to services like:
    // - Sentry: Sentry.captureException(new Error(errorData.message))
    // - LogRocket: LogRocket.captureException(new Error(errorData.message))
    // - Bugsnag: Bugsnag.notify(new Error(errorData.message))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Failed to log error:", error)
    return NextResponse.json({ error: "Failed to log error" }, { status: 500 })
  }
}
