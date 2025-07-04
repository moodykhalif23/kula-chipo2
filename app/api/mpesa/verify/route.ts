import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { code, plan } = await req.json()

  // Get credentials from env
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY

  if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
    return NextResponse.json({ error: "M-Pesa credentials not configured." }, { status: 500 })
  }

  // TODO: Integrate with M-Pesa API to verify the transaction code
  // For now, mock verification: accept any non-empty code
  if (typeof code === "string" && code.trim().length > 0) {
    // You would call the M-Pesa API here and check the transaction status
    return NextResponse.json({ success: true, message: "Payment verified. Subscription activated." })
  } else {
    return NextResponse.json({ error: "Invalid or missing transaction code." }, { status: 400 })
  }
} 