import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiUser, FiLogOut, FiBookmark } from 'react-icons/fi';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-b from-black to-transparent z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-3xl font-bold text-primary">
              StreamApp
            </Link>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link to="/browse" className="hover:text-gray-300 transition">
                  Browse
                </Link>
                <Link to="/watchlist" className="hover:text-gray-300 transition">
                  My List
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/watchlist" className="hover:text-primary transition">
                  <FiBookmark size={20} />
                </Link>
                <Link to="/profile" className="hover:text-primary transition">
                  <FiUser size={20} />
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-primary transition"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
