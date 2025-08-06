import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, SortAsc, SortDesc, Palette, Filter, X } from 'lucide-react'

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [minRating, setMinRating] = useState('')
  const [theme, setTheme] = useState('dark')
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
    // Apply theme to body
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Game Reviews
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Discover and share your gaming experiences with the community
        </p>
      </div>

      {/* Theme Selector */}
      <div className="theme-selector">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Customize Theme</h3>
        </div>
        <div className="theme-buttons">
          {themes.map((themeOption) => (
            <button
              key={themeOption.name}
              onClick={() => setTheme(themeOption.name)}
              className={`theme-button ${theme === themeOption.name ? 'active' : ''}`}
            >
              {themeOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="  Search for posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none backdrop-blur-sm"
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sort-button ${showFilters ? 'active' : ''}`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-indigo-500 text-xs px-1.5 py-0.5 rounded-full">
                  {[selectedPlatform, selectedGenre, minRating, searchTerm].filter(Boolean).length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleSortChange('created_at')}
              className={`sort-button ${sortBy === 'created_at' ? 'active' : ''}`}
            >
              {sortBy === 'created_at' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span>Date</span>
            </button>
            
            <button
              onClick={() => handleSortChange('upvotes')}
              className={`sort-button ${sortBy === 'upvotes' ? 'active' : ''}`}
            >
              {sortBy === 'upvotes' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span>Upvotes</span>
            </button>

            <button
              onClick={() => handleSortChange('rating')}
              className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`}
            >
              {sortBy === 'rating' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span>Rating</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-section fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Filter Reviews</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white text-sm backdrop-blur-sm"
                >
                  <option value="">All Platforms</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white text-sm backdrop-blur-sm"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white text-sm backdrop-blur-sm"
                >
                  <option value="">Any Rating</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}+ Stars</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="font-semibold text-white">{filteredPosts.length}</span> 
            <span> review{filteredPosts.length !== 1 ? 's' : ''} found</span>
            {hasActiveFilters && <span className="text-indigo-400 ml-2">(filtered)</span>}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Show all reviews
            </button>
          )}
        </div>
        
        {/* Posts Grid or Empty State */}
        {filteredPosts.length === 0 ? (
          <div className="game-card text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              {hasActiveFilters
                ? 'No reviews match your current filters.' 
                : 'No reviews yet. Be the first to create one!'}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-semibold"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage