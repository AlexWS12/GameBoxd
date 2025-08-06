import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, SortAsc, SortDesc, Palette, Filter, X } from 'lucide-react'

const HomePage = ({ theme, setTheme }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [minRating, setMinRating] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const platforms = ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile', 'Other']
  const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Sports', 'Racing', 'Fighting', 'Horror', 'Indie', 'Other']
  const themes = [
    { name: 'dark', label: 'Dark Mode', bg: 'bg-slate-900', card: 'bg-slate-800' },
    { name: 'blue', label: 'Ocean Blue', bg: 'bg-blue-900', card: 'bg-blue-800' },
    { name: 'purple', label: 'Purple Haze', bg: 'bg-purple-900', card: 'bg-purple-800' },
    { name: 'green', label: 'Matrix Green', bg: 'bg-green-900', card: 'bg-green-800' }
  ]

  useEffect(() => {
    fetchPosts()
  }, [sortBy, sortOrder])

  useEffect(() => {
    const currentTheme = themes.find(t => t.name === theme)
    if (currentTheme) {
      document.body.className = `font-inter min-h-screen ${currentTheme.bg}`
    }
  }, [theme])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.game_title && post.game_title.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesPlatform = !selectedPlatform || post.platform === selectedPlatform
    const matchesGenre = !selectedGenre || post.genre === selectedGenre
    const matchesRating = !minRating || (post.rating && post.rating >= parseInt(minRating))

    return matchesSearch && matchesPlatform && matchesGenre && matchesRating
  })

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  const clearFilters = () => {
    setSelectedPlatform('')
    setSelectedGenre('')
    setMinRating('')
    setSearchTerm('')
  }

  const hasActiveFilters = selectedPlatform || selectedGenre || minRating || searchTerm

  if (loading) return <LoadingSpinner />

  const currentTheme = themes.find(t => t.name === theme)

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4 pb-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Game Reviews
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Discover and share your gaming experiences with the community
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="text-gray-400 mr-2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Palette className="text-indigo-400" />
          <span className="text-white font-medium">Theme:</span>
          {themes.map(t => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`rounded-full px-3 py-1 text-sm font-semibold border-2 transition-all duration-200 ${theme === t.name ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800 text-gray-300 border-slate-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`sort-button ${showFilters ? 'active' : ''}`}
          >
            <Filter className="w-4 h-4" /> Filters
            {hasActiveFilters && <span className="ml-1 bg-indigo-500 text-white rounded-full px-2 text-xs">{[selectedPlatform, selectedGenre, minRating, searchTerm].filter(Boolean).length}</span>}
          </button>

          <button onClick={() => handleSortChange('created_at')} className={`sort-button ${sortBy === 'created_at' ? 'active' : ''}`}>
            {sortBy === 'created_at' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />} Date
          </button>

          <button onClick={() => handleSortChange('upvotes')} className={`sort-button ${sortBy === 'upvotes' ? 'active' : ''}`}>
            {sortBy === 'upvotes' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />} Upvotes
          </button>

          <button onClick={() => handleSortChange('rating')} className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`}>
            {sortBy === 'rating' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />} Rating
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-section fade-in">
          <div className="flex justify-between mb-4">
            <h3 className="text-white font-medium text-lg">Advanced Filters</h3>
            <button onClick={clearFilters} className="text-red-400 text-sm hover:underline flex items-center gap-1">
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-200 mb-1">Platform</label>
              <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2">
                <option value="">All</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-1">Genre</label>
              <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2">
                <option value="">All</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-1">Min Rating</label>
              <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2">
                <option value="">Any</option>
                {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}+</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span><strong className="text-white">{filteredPosts.length}</strong> result{filteredPosts.length !== 1 && 's'}</span>
          {hasActiveFilters && <button onClick={clearFilters} className="text-indigo-400 hover:underline">Clear filters</button>}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>{hasActiveFilters ? 'No posts match your filters.' : 'No posts yet. Be the first!'}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage