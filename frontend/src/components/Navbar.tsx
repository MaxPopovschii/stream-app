import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiLogOut, FiBookmark } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import ThemeSwitcher from './ThemeSwitcher';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvatar();
    }
  }, [isAuthenticated]);

  const fetchAvatar = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.avatarUrl) {
        setAvatarUrl(response.data.avatarUrl);
      }
    } catch (error) {
      // Use default avatar on error
    }
  };

  return (
    <nav className="fixed top-0 w-full glass backdrop-blur-xl z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-3xl font-bold whitespace-nowrap">
              <span className="gradient-text">StreamApp</span>
            </Link>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-8">
                <Link to="/browse" className="text-gray-300 hover:text-white transition-colors font-medium">
                  Browse
                </Link>
                <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors font-medium">
                  My List
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="hidden lg:block flex-1 max-w-xl">
              <SearchBar />
            </div>
          )}

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/watchlist" className="text-gray-300 hover:text-primary transition-colors">
                  <FiBookmark size={22} />
                </Link>
                <NotificationCenter />
                <Link to="/profile" className="group relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-primary transition-all shadow-elegant">
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </Link>
                <ThemeSwitcher />
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-primary transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={22} />
                </button>
              </>
            ) : (
              <>
                <ThemeSwitcher />
                <Link to="/login" className="btn-secondary text-sm px-6 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-6 py-2">
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
