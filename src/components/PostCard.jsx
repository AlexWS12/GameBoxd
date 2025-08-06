import { Link, useNavigate } from 'react-router-dom'
import { Calendar, ThumbsUp, Star, Copy } from 'lucide-react'

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    if (!rating) return null
    return (
      <div className="stars-display">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 star ${i < rating ? 'filled' : ''}`}
          />
        ))}
        <span className="text-sm text-gray-400 ml-2">{rating}/10</span>
      </div>
    )
  }

  const handleRepost = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/create?repost=${post.id}`)
  }

  return (
    <div className="post-card fade-in relative group">
      <Link to={`/post/${post.id}`} className="block">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2 hover:text-indigo-400 transition-colors">
              {post.title}
            </h3>
            {post.game_title && (
              <p className="text-indigo-400 font-medium mb-2">{post.game_title}</p>
            )}
            {post.platform && (
              <span className="inline-block bg-gray-700/80 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                {post.platform}
              </span>
            )}
          </div>
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-20 h-20 object-cover rounded-xl ml-4 border border-gray-600/50"
            />
          )}
        </div>

        {post.rating && (
          <div className="mb-4">
            {renderStars(post.rating)}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.upvotes || 0}</span>
            </div>
          </div>
          {post.genre && (
            <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-lg text-xs">{post.genre}</span>
          )}
        </div>
      </Link>
      
      {/* Repost Button - Shows on hover */}
      <button
        onClick={handleRepost}
        className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
        title="Repost this review"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  )
}

export default PostCard