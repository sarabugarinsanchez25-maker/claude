import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Library() {
  const [shelfItems, setShelfItems] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('want_to_read')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  useEffect(() => {
    loadLibrary()
  }, [user])

  async function loadLibrary() {
    try {
      const { data, error } = await supabase
        .from('shelf_items')
        .select('*, books(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setShelfItems(data || [])
    } catch (err) {
      console.error('Error al cargar biblioteca:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(itemId, newStatus) {
    try {
      const { error } = await supabase
        .from('shelf_items')
        .update({
          status: newStatus,
          started_at: newStatus === 'reading' ? new Date() : null,
          finished_at: newStatus === 'read' ? new Date() : null,
        })
        .eq('id', itemId)

      if (error) throw error
      loadLibrary()
    } catch (err) {
      alert('Error al actualizar: ' + err.message)
    }
  }

  async function removeBook(itemId) {
    try {
      const { error } = await supabase
        .from('shelf_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      loadLibrary()
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const filteredItems = shelfItems.filter((item) => item.status === selectedStatus)

  const statusLabels = {
    want_to_read: 'Quiero leer',
    reading: 'Leyendo',
    read: 'Leído',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">StoryVerse</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/search')}
              className="text-gray-600 hover:text-primary-600 font-semibold"
            >
              Buscar libros
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de estado */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                selectedStatus === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {label} ({shelfItems.filter((item) => item.status === key).length})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Cargando tu biblioteca...</p>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {item.books.cover_url && (
                  <img src={item.books.cover_url} alt={item.books.title} className="w-full h-64 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">{item.books.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-1 mb-3">{item.books.authors}</p>

                  {/* Selector de estado */}
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-3 focus:outline-none focus:border-primary-500"
                  >
                    <option value="want_to_read">Quiero leer</option>
                    <option value="reading">Leyendo</option>
                    <option value="read">Leído</option>
                  </select>

                  <button
                    onClick={() => removeBook(item.id)}
                    className="w-full bg-red-100 text-red-600 py-1 rounded font-semibold hover:bg-red-200 text-xs"
                  >
                    Quitar de biblioteca
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hay libros en esta categoría</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
            >
              Buscar libros
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
