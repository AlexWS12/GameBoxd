import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white' 
      }}>
        <Navbar />
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem',
          position: 'relative'
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Routes>
        </div>
        
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: -1,
            opacity: 0.1
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: '60%',
              right: '15%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
              animation: 'float 8s ease-in-out infinite reverse'
            }}
          />
        </div>
      </div>
    </Router>
  )
}

export default App