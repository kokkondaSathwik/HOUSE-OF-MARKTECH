import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/db"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "1d" })

    return NextResponse.json({
      token,
      isAdmin: user.isAdmin,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Server error during login" }, { status: 500 })
  }
}

