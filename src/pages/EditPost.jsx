import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import { Save, Star, Shield } from 'lucide-react'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [secretKey, setSecretKey] = useState('')
  const [verified, setVerified] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    game_title: '',
    rating: 0,
    platform: '',
    genre: ''
  })

  const platforms = ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile', 'Other']
  const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Sports', 'Racing', 'Fighting', 'Horror', 'Indie', 'Other']

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      setFormData({
        title: data.title || '',
        content: data.content || '',
        image_url: data.image_url || '',
        game_title: data.game_title || '',
        rating: data.rating || 0,
        platform: data.platform || '',
        genre: data.genre || ''
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyKey = async () => {
    if (!secretKey.trim()) {
      alert('Please enter a secret key')
      return
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('secret_key')
        .eq('id', id)
        .single()

      if (error) throw error
      
      if (data.secret_key === secretKey) {
        setVerified(true)
      } else {
        alert('Invalid secret key!')
      }
    } catch (error) {
      console.error('Error verifying key:', error)
      alert('Error verifying secret key')
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

    setSaving(true)
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: formData.title,
          content: formData.content || null,
          image_url: formData.image_url || null,
          game_title: formData.game_title || null,
          rating: formData.rating > 0 ? parseInt(formData.rating) : null,
          platform: formData.platform || null,
          genre: formData.genre || null
        })
        .eq('id', id)

      if (error) throw error

      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post. Please try again.')
    } finally {
      setSaving(false)
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

  if (!verified) {
    return (
      <div className="max-w-md mx-auto">
        <div className="game-card text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Verify Secret Key</h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Enter the secret key you used when creating this post to edit it.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerifyKey()}
            />
            <button
              onClick={handleVerifyKey}
              className="w-full btn-primary px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Verify Access
            </button>
            <button
              onClick={() => navigate(`/post/${id}`)}
              className="w-full px-6 py-3 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Back to Post
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Edit Review</h1>
        <p className="text-xl text-gray-300 leading-relaxed">Update your gaming experience review</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
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
              <p className="text-sm text-gray-400 mt-2">Click on stars to update your rating</p>
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 btn-primary"
          >
            {saving ? (
              <div className="loading"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Update Review</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="px-8 py-4 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost