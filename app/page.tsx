"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Property {
  _id: string
  name: string
  image: string
  price: number
  location: string
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token")

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties")
        if (!response.ok) {
          throw new Error("Failed to fetch properties")
        }
        const data = await response.json()
        setProperties(data)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Featured Properties</h1>
        <div className="space-x-2">
          {!isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/signup")}>Sign Up</Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
              }}
            >
              Logout
            </Button>
          )}
          {isLoggedIn && localStorage.getItem("isAdmin") === "true" && (
            <Button onClick={() => router.push("/admin")}>Admin Panel</Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={property.image || "/placeholder.svg?height=400&width=600"}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{property.name}</h2>
                <p className="text-gray-500">{property.location}</p>
                <p className="text-lg font-bold mt-2">${property.price.toLocaleString()}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

