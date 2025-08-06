import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'

function App() {
  const [theme, setTheme] = useState('dark')

  const themes = {
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    blue: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    purple: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%)',
    green: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
  }

  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          background: themes[theme],
          color: 'white'
        }}
      >
        <Navbar />
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            position: 'relative'
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage theme={theme} setTheme={setTheme} />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App