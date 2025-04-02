import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Property from "@/models/Property"
import { verifyToken, isAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin access
    const user = await verifyToken(req)
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 })
    }

    await connectDB()

    const property = await Property.findById(params.id)

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ message: "Server error while fetching property" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(params.id, { name, image, price, location }, { new: true })

    if (!updatedProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Property updated successfully",
      property: updatedProperty,
    })
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ message: "Server error while updating property" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin access
    const user = await verifyToken(req)
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 })
    }

    await connectDB()

    const deletedProperty = await Property.findByIdAndDelete(params.id)

    if (!deletedProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Property deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ message: "Server error while deleting property" }, { status: 500 })
  }
}

