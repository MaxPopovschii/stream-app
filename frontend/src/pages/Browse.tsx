import { useState, useEffect } from 'react';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';
import ContinueWatching from '../components/ContinueWatching';

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  genre: string;
  year: number;
  rating?: string;
  cast: string[];
  director: string;
  views: number;
  likes: number;
  tags: string[];
}

export default function Browse() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [trending, setTrending] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = [
    { value: 'all', label: 'All' },
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'horror', label: 'Horror' },
    { value: 'scifi', label: 'Sci-Fi' },
    { value: 'romance', label: 'Romance' },
    { value: 'technology', label: 'Technology' },
    { value: 'reality', label: 'Reality' }
  ];

  useEffect(() => {
    fetchVideos();
    fetchTrending();
  }, [selectedGenre]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const endpoint = selectedGenre === 'all' 
        ? '/videos?limit=20'
        : `/videos/genre/${selectedGenre}?limit=20`;
      
      const response = await api.get(endpoint);
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await api.get('/videos/trending?limit=10');
      setTrending(response.data.videos || []);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const handleAddToWatchlist = async (videoId: string) => {
    try {
      await api.post(`/users/watchlist/${videoId}`);
      alert('Added to watchlist!');
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header con Gradient */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-light to-dark">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Discover
            <span className="gradient-text block">Great Content</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">Explore our curated collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Continue Watching Section */}
        <ContinueWatching />

        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {trending.map((video) => (
                <VideoCard
                  key={video._id}
                  video={{ id: video._id, ...video }}
                  onAddToWatchlist={handleAddToWatchlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* Genre Filter con Pills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre.value}
                onClick={() => setSelectedGenre(genre.value)}
                className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  selectedGenre === genre.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                    : 'glass hover:bg-white/10'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400 font-light text-lg">Loading amazing content...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={{ id: video._id, ...video }}
                onAddToWatchlist={handleAddToWatchlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-24 h-24 mx-auto mb-6 bg-dark-lighter rounded-full flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
            <p className="text-2xl text-gray-400 font-light">No videos found</p>
            <p className="text-gray-500 mt-2">Try selecting a different genre</p>
          </div>
        )}
      </div>
    </div>
  );
}
