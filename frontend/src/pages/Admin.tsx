import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface Property {
  _id: string
  name: string
  image: string
  price: number
  location: string
  description: string
}

const Admin = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    location: '',
    description: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin')

    if (!token || isAdmin !== 'true') {
      navigate('/login')
      return
    }

    fetchProperties()
  }, [navigate])

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/properties`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setProperties(response.data)
    } catch (error) {
      setError('Failed to fetch properties')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (editingProperty) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/properties/${editingProperty._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/properties`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      fetchProperties()
      resetForm()
    } catch (error) {
      setError('Failed to save property')
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProperties()
    } catch (error) {
      setError('Failed to delete property')
      console.error('Error:', error)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      name: property.name,
      image: property.image,
      price: property.price.toString(),
      location: property.location,
      description: property.description
    })
  }

  const resetForm = () => {
    setEditingProperty(null)
    setFormData({
      name: '',
      image: '',
      price: '',
      location: '',
      description: '',
    })
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('isAdmin')
            navigate('/login')
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Property Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProperty ? 'Edit Property' : 'Add New Property'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingProperty ? 'Update Property' : 'Add Property'}
            </button>
            {editingProperty && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <p className="text-blue-600 font-bold mb-4">${property.price.toLocaleString()}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(property)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin 