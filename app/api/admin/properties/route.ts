import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Property from "@/models/Property"
import { verifyToken, isAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Verify admin access
    const user = await verifyToken(req)
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 })
    }

    await connectDB()

    const properties = await Property.find().sort({ createdAt: -1 })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ message: "Server error while fetching properties" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Verify admin access
    const user = await verifyToken(req)
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 })
    }

    await connectDB()

    const { name, image, price, location } = await req.json()

    // Validate required fields
    if (!name || !image || !price || !location) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Create new property
    const property = new Property({
      name,
      image,
      price,
      location,
    })

    await property.save()

    return NextResponse.json({ message: "Property added successfully", property }, { status: 201 })
  } catch (error) {
    console.error("Error adding property:", error)
    return NextResponse.json({ message: "Server error while adding property" }, { status: 500 })
  }
}

