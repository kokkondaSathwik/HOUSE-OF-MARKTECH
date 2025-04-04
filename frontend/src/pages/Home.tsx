import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Property {
  _id: string
  name: string
  image: string
  price: number
  location: string
  status: 'active' | 'inactive'
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'newest'
  })
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const queryParams = new URLSearchParams()
        if (filter.minPrice) queryParams.append('minPrice', filter.minPrice)
        if (filter.maxPrice) queryParams.append('maxPrice', filter.maxPrice)
        if (filter.location) queryParams.append('location', filter.location)
        queryParams.append('sortBy', filter.sortBy)

        console.log('Fetching properties from:', `${API_URL}/api/properties?${queryParams}`)
        const response = await fetch(`${API_URL}/api/properties?${queryParams}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Received properties:', data)
        setProperties(data)
      } catch (error) {
        console.error('Error fetching properties:', error)
        setError(error instanceof Error ? error.message : 'Failed to load properties. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filter])

  const handleImageError = (propertyId: string) => {
    console.log('Image load error for property:', propertyId)
    setImageLoadErrors(prev => ({ ...prev, [propertyId]: true }))
  }

  const PropertySkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )

  const PropertyImage = ({ property }: { property: Property }) => {
    const hasError = imageLoadErrors[property._id]
    const fallbackImage = '/placeholder.svg'

    return (
      <div className="relative h-48 overflow-hidden group">
        {hasError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img
            src={property.image || fallbackImage}
            alt={property.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={() => handleImageError(property._id)}
            loading="lazy"
            crossOrigin="anonymous"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
      </div>
    )
  }

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

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                value={filter.minPrice}
                onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                value={filter.maxPrice}
                onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={filter.location}
                onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <PropertyImage property={property} />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{property.name}</h2>
                  <p className="text-gray-500">{property.location}</p>
                  <p className="text-lg font-bold mt-2 text-blue-600">
                    ${property.price.toLocaleString()}
                  </p>
                  <button 
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                  >
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