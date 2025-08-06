import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import { Save, Star, Copy } from 'lucide-react'

const CreatePost = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const repostId = searchParams.get('repost')
  
  const [loading, setLoading] = useState(false)
  const [repostLoading, setRepostLoading] = useState(false)
  const [repostPostId, setRepostPostId] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    game_title: '',
    rating: 0,
    platform: '',
    genre: '',
    secret_key: ''
  })

  const platforms = ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile', 'Other']
  const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Sports', 'Racing', 'Fighting', 'Horror', 'Indie', 'Other']

  const handleRepost = async () => {
    if (!repostPostId.trim()) {
      alert('Please enter a post ID')
      return
    }

    setRepostLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', repostPostId)
        .single()

      if (error) {
        alert('Post not found')
        return
      }

      setFormData({
        title: `Re: ${data.title}`,
        content: data.content || '',
        image_url: data.image_url || '',
        game_title: data.game_title || '',
        rating: data.rating || 0,
        platform: data.platform || '',
        genre: data.genre || '',
        secret_key: ''
      })
    } catch (error) {
      console.error('Error fetching post for repost:', error)
      alert('Error loading post for repost')
    } finally {
      setRepostLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a title for your post')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: formData.title,
          content: formData.content || null,
          image_url: formData.image_url || null,
          game_title: formData.game_title || null,
          rating: formData.rating > 0 ? parseInt(formData.rating) : null,
          platform: formData.platform || null,
          genre: formData.genre || null,
          secret_key: formData.secret_key || null
        }])
        .select()

      if (error) throw error

      navigate(`/post/${data[0].id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStarRating = () => {
    return (
      <div className="star-rating">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleRatingChange(i + 1)}
            className={i < formData.rating ? 'filled' : ''}
          >
            <Star className="w-6 h-6" />
          </button>
        ))}
        {formData.rating > 0 && (
          <span className="text-gray-300 ml-3 font-medium text-lg">{formData.rating}/10</span>
        )}
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Create New Review</h1>
        <p className="text-xl text-gray-300 leading-relaxed">Share your gaming experience with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        {/* Repost Section */}
        <div className="game-card">
          <div className="flex items-center space-x-3 mb-6">
            <Copy className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Repost Existing Review</h2>
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Enter post ID to repost"
              value={repostPostId}
              onChange={(e) => setRepostPostId(e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleRepost}
              disabled={repostLoading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap"
            >
              {repostLoading ? <div className="loading"></div> : 'Load Post'}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Enter a post ID to load its content and create a repost
          </p>
        </div>

        {/* Main Form */}
        <div className="game-card">
          <div className="form-grid">
            {/* Title - Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Review Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's your review about?"
                required
              />
            </div>

            {/* Game Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Game Title
              </label>
              <input
                type="text"
                name="game_title"
                value={formData.game_title}
                onChange={handleInputChange}
                placeholder="Which game are you reviewing?"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Rating (1-10 stars)
              </label>
              {renderStarRating()}
              <p className="text-sm text-gray-400 mt-2">Click on stars to set your rating</p>
            </div>

            {/* Platform and Genre */}
            <div className="form-row two-columns">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                >
                  <option value="">Select Platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Review Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your thoughts about the game..."
                rows={6}
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Secret Key */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Secret Key (Optional)
              </label>
              <input
                type="password"
                name="secret_key"
                value={formData.secret_key}
                onChange={handleInputChange}
                placeholder="Enter a secret key to edit/delete later"
              />
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Save this key to edit or delete your post later
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 btn-primary"
          >
            {loading ? (
              <div className="loading"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create Review</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost