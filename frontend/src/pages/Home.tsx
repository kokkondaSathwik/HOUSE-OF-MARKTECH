import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Property {
  _id: string
  name: string
  image: string
  price: number
  location: string
}

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data = await response.json()
        setProperties(data)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Welcome to House of MarkTech</h1>
          <p className="text-xl text-center max-w-2xl">
            Your premier destination for finding the perfect property. Discover luxury homes, modern apartments, and everything in between.
          </p>
        </div>
      </div>

      {/* Existing Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <div className="space-x-2">
            {!localStorage.getItem('token') ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Admin Dashboard
              </button>
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
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={property.image || '/placeholder.svg'}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{property.name}</h2>
                  <p className="text-gray-500">{property.location}</p>
                  <p className="text-lg font-bold mt-2">
                    ${property.price.toLocaleString()}
                  </p>
                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home 