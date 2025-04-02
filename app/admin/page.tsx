"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2 } from "lucide-react"

interface Property {
  _id: string
  name: string
  image: string
  price: number
  location: string
}

export default function AdminPanel() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    location: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token")
    const isAdmin = localStorage.getItem("isAdmin")

    if (!token || isAdmin !== "true") {
      router.push("/login")
      return
    }

    fetchProperties()
  }, [router])

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/admin/properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("isAdmin")
          router.push("/login")
          return
        }
        throw new Error("Failed to fetch properties")
      }

      const data = await response.json()
      setProperties(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching properties")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const token = localStorage.getItem("token")
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/admin/properties/${editingId}` : "/api/admin/properties"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          price: Number(formData.price),
          location: formData.location,
        }),
      })

      if (!response.ok) {
        throw new Error(editingId ? "Failed to update property" : "Failed to add property")
      }

      // Reset form and refresh properties
      setFormData({ name: "", image: "", price: "", location: "" })
      setEditingId(null)
      fetchProperties()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error saving property")
    }
  }

  const handleEdit = (property: Property) => {
    setEditingId(property._id)
    setFormData({
      name: property.name,
      image: property.image,
      price: property.price.toString(),
      location: property.location,
    })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete property")
      }

      fetchProperties()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error deleting property")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: "", image: "", price: "", location: "" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Property" : "Add New Property"}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">{editingId ? "Update Property" : "Add Property"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p>No properties found. Add your first property above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Location</th>
                    <th className="text-left py-2 px-4">Price</th>
                    <th className="text-right py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property._id} className="border-b">
                      <td className="py-2 px-4">{property.name}</td>
                      <td className="py-2 px-4">{property.location}</td>
                      <td className="py-2 px-4">${property.price.toLocaleString()}</td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(property)} className="mr-2">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(property._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

