import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import api from '../lib/api';

interface SearchResult {
  _id: string;
  title: string;
  thumbnailUrl: string;
  year: number;
  genre: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchVideos = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/videos/search?q=${encodeURIComponent(query)}&limit=5`);
        setResults(response.data.videos || []);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchVideos, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (videoId: string) => {
    navigate(`/watch/${videoId}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search movies, shows..."
          className="w-full pl-12 pr-12 py-3 glass rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-white placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl shadow-elegant-lg max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((video) => (
                <button
                  key={video._id}
                  onClick={() => handleResultClick(video._id)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors text-left"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{video.title}</h4>
                    <p className="text-sm text-gray-400">
                      {video.year} • {video.genre}
                    </p>
                  </div>
                </button>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 px-3">
                <button
                  onClick={() => {
                    navigate(`/browse?search=${query}`);
                    setIsOpen(false);
                  }}
                  className="text-sm text-primary hover:text-primary-light transition-colors"
                >
                  See all results for "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
