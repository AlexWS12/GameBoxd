import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import { ThumbsUp, Edit, Trash2, MessageCircle, Calendar, Star, Copy, Share } from 'lucide-react'

const PostPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [originalPost, setOriginalPost] = useState(null)
  const fetchOriginalPost = async (originalId) => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('id', originalId)
    .single()

  if (!error) {
    setOriginalPost(data)
  }
}
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)

useEffect(() => {
  fetchPost()
  fetchComments()
  const upvoted = localStorage.getItem(`upvoted_${id}`)
  setHasUpvoted(!!upvoted)
}, [id])

const fetchPost = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    setPost(data)

    if (data?.repost_of) {
      await fetchOriginalPost(data.repost_of)
    }
  } catch (error) {
    console.error('Error fetching post:', error)
  } finally {
    setLoading(false)
  }
}

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleUpvote = async () => {
    if (hasUpvoted) {
      alert('You have already upvoted this post!')
      return
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: (post.upvotes || 0) + 1 })
        .eq('id', id)

      if (error) throw error
      setPost({ ...post, upvotes: (post.upvotes || 0) + 1 })
      setHasUpvoted(true)
      localStorage.setItem(`upvoted_${id}`, 'true')
    } catch (error) {
      console.error('Error upvoting post:', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: id,
          content: newComment,
          author_name: authorName || 'Anonymous'
        }])
        .select()

      if (error) throw error
      setComments([...comments, data[0]])
      setNewComment('')
      setAuthorName('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleDelete = async () => {
    if (!post.secret_key || secretKey !== post.secret_key) {
      alert('Invalid secret key!')
      return
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleEdit = () => {
    if (!post.secret_key || secretKey !== post.secret_key) {
      alert('Invalid secret key!')
      return
    }
    navigate(`/edit/${id}`)
  }

  const handleRepost = () => {
    navigate(`/create?repost=${id}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out this game review: ${post.title}`,
        url: window.location.href
      })
    } else {
      // copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating) => {
    if (!rating) return null
    return (
      <div className="stars-display">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 star ${i < rating ? 'filled' : ''}`}
          />
        ))}
        <span className="text-lg font-medium text-gray-300 ml-3">{rating}/10</span>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />
  if (!post) return <div className="text-center text-gray-400">Post not found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="game-card p-8 mb-8 fade-in">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
            {post.game_title && (
              <h2 className="text-xl text-indigo-400 font-medium mb-4">{post.game_title}</h2>
            )}
            
            <div className="flex flex-wrap gap-4 mb-4">
              {post.platform && (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {post.platform}
                </span>
              )}
              {post.genre && (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {post.genre}
                </span>
              )}
              <span className="bg-blue-700 text-blue-300 px-3 py-1 rounded-full text-sm">
                ID: {post.id}
              </span>
            </div>

            {post.rating && (
              <div className="mb-4">
                {renderStars(post.rating)}
              </div>
            )}
          </div>

          {post.image_url && (
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-48 h-48 object-cover rounded-lg ml-6"
            />
          )}
        </div>

{originalPost && (
  <div className="mb-4">
    <p className="text-sm text-gray-400">
      Reposted from{' '}
      <Link 
        to={`/post/${originalPost.id}`} 
        className="underline text-indigo-400 hover:text-indigo-300"
      >
        {originalPost.title}
      </Link>
    </p>
  </div>
)}

        {post.content && (
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <button
              onClick={handleUpvote}
              disabled={hasUpvoted}
              className={`flex items-center space-x-1 transition-colors ${
                hasUpvoted 
                  ? 'text-indigo-400 cursor-not-allowed' 
                  : 'hover:text-indigo-400 cursor-pointer'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
              <span>{post.upvotes || 0} upvotes</span>
            </button>
            <button
              onClick={handleRepost}
              className="flex items-center space-x-1 hover:text-green-400 transition-colors"
              title="Repost this review"
            >
              <Copy className="w-4 h-4" />
              <span>Repost</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
              title="Share this post"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {post.secret_key && (
            <div className="flex items-center space-x-2">
              <input
                type="password"
                placeholder="Secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
              />
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                title="Edit post"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="game-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Comments ({comments.length})</span>
        </h3>

        <form onSubmit={handleAddComment} className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none mb-3"
            />
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none resize-vertical"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors btn-primary"
          >
            Add Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 p-4 rounded-lg fade-in">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-indigo-400">{comment.author_name}</span>
                  <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-700/80 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostPage