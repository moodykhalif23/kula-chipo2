Guidance: Integrating the Real M-Pesa API (Daraja)
A. Overview
Safaricom’s M-Pesa Daraja API is the official way to programmatically verify payments.
The most common flow for online payments is STK Push (Lipa na M-Pesa Online).
For verifying a transaction code (C2B), you’ll use the Transaction Status API.
B. Steps to Integrate
1. Get OAuth Token
Make a POST request to https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
Use HTTP Basic Auth with your MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET.
2. Call Transaction Status API
Endpoint: https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query
Use the OAuth token in the Authorization: Bearer <token> header.
POST body (JSON):
Apply to route.ts
  {
    "Initiator": "testapi",
    "SecurityCredential": "<encrypted_password>",
    "CommandID": "TransactionStatusQuery",
    "TransactionID": "<mpesa_code>",
    "PartyA": "<your_shortcode>",
    "IdentifierType": "4",
    "ResultURL": "<your_callback_url>",
    "QueueTimeOutURL": "<your_callback_url>",
    "Remarks": "Subscription payment verification",
    "Occasion": "Subscription"
  }
SecurityCredential is an encrypted password (see Daraja docs).
3. Handle the Callback
M-Pesa will POST the result to your ResultURL.
You must expose an endpoint to receive and process this callback.
4. Sandbox vs Production
Use sandbox credentials for testing.
Switch to production credentials and endpoints for live.
5. Official Docs
Daraja API Docs
2. Add Subscription Logic (Update User Records on Payment)
A. Where to Add Logic
PayPal: In the onApprove handler (frontend), or better, in a backend webhook for security.
M-Pesa: In the API route after successful verification.
B. Example: Update User in API Route
Suppose you have a user model and authentication. Here’s a pattern for both PayPal and M-Pesa:
Backend (API Route) Example
Apply to route.ts
// After verifying payment...
import { getServerSession } from \"next-auth\" // or your auth system
import { db } from \"@/lib/db\" // your DB utility

const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json({ error: \"Not authenticated\" }, { status: 401 })
}

// Update user subscription in DB
await db.user.update({
  where: { id: session.user.id },
  data: {
    subscriptionPlan: plan,
    subscriptionActive: true,
    subscriptionPaidAt: new Date(),
    // ...other fields
  }
})
Frontend (PayPal)
After successful payment, you can call a backend API to update the user’s subscription, or use a webhook for more security.
Summary of Next Steps
Integrate M-Pesa API:
Implement OAuth, call Transaction Status API, handle callback, and update your logic accordingly.
Update User Records:
After payment (PayPal or M-Pesa), update the user’s subscription status in your database.
Would you like a code sample for the M-Pesa OAuth/token and Transaction Status call, or a sample DB update for user subscriptions? If you tell me your DB/auth setup, I can tailor the code!
