import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Gamepad2 } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/80">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-white hover:text-indigo-400 transition-colors duration-200 group"
          >
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:bg-indigo-500 transition-colors duration-200">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GameBoxd</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/70'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/create" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                isActive('/create') 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New Review</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar