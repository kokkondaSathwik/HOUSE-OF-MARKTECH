import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Property from "@/models/Property"

export async function GET() {
  try {
    await connectDB()

    const properties = await Property.find().sort({ createdAt: -1 })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ message: "Server error while fetching properties" }, { status: 500 })
  }
}

