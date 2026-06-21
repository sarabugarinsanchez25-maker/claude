import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')

    try {
      // Buscar en Google Books API (sin API key para esta versión)
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=10`
      )

      if (!response.ok) throw new Error('Error en la búsqueda')

      const data = await response.json()
      const books = data.items?.map((item) => ({
        googleBooksId: item.id,
        title: item.volumeInfo.title,
        authors: (item.volumeInfo.authors || []).join(', '),
        coverUrl: item.volumeInfo.imageLinks?.thumbnail || '',
        description: item.volumeInfo.description || '',
        publishedDate: item.volumeInfo.publishedDate || '',
        pageCount: item.volumeInfo.pageCount || 0,
      })) || []

      setResults(books)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddBook(book) {
    try {
      // Guardar o obtener el libro en la tabla books
      const { data: existingBook } = await supabase
        .from('books')
        .select('id')
        .eq('google_books_id', book.googleBooksId)
        .single()

      let bookId = existingBook?.id

      if (!bookId) {
        const { data: newBook, error: bookError } = await supabase
          .from('books')
          .insert({
            google_books_id: book.googleBooksId,
            title: book.title,
            authors: book.authors,
            cover_url: book.coverUrl,
            description: book.description,
            published_date: book.publishedDate,
            page_count: book.pageCount,
          })
          .select()
          .single()

        if (bookError) throw bookError
        bookId = newBook.id
      }

      // Añadir a la estantería del usuario
      const { error: shelfError } = await supabase
        .from('shelf_items')
        .insert({
          user_id: user.id,
          book_id: bookId,
          status: 'want_to_read',
        })

      if (shelfError) {
        if (shelfError.code === '23505') {
          alert('Este libro ya está en tu biblioteca')
        } else {
          throw shelfError
        }
      } else {
        alert('Libro añadido a tu biblioteca')
      }
    } catch (err) {
      alert('Error al añadir el libro: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">StoryVerse</h1>
          <button
            onClick={() => navigate('/library')}
            className="text-gray-600 hover:text-primary-600 font-semibold"
          >
            Mi biblioteca
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Búsqueda */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Busca libros por título, autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Resultados */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((book) => (
              <div key={book.googleBooksId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {book.coverUrl && (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-64 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-1 mb-3">{book.authors}</p>
                  <button
                    onClick={() => handleAddBook(book)}
                    className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700"
                  >
                    Añadir a biblioteca
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && searchQuery && (
          <p className="text-center text-gray-600">No se encontraron resultados</p>
        )}
      </main>
    </div>
  )
}
