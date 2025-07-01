import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Mock user database - replace with real database in production
const users = [
  {
    id: "1",
    email: "demo@kulachipo.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password123
    name: "Demo Customer",
    role: "customer",
    image: null,
  },
  {
    id: "2",
    email: "vendor@kulachipo.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password123
    name: "Demo Vendor",
    role: "vendor",
    image: null,
  },
]

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Registration attempt")

    const body = await request.json()
    const { name, email, password, role } = body

    console.log("📝 Registration data:", { name, email, role })

    // Validation
    if (!name || !email || !password || !role) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (!["customer", "vendor"].includes(role)) {
      console.log("❌ Invalid role:", role)
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      console.log("❌ User already exists:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      role,
      image: null,
    }

    // Add to mock database
    users.push(newUser)

    console.log("✅ User registered successfully:", email, role)

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
