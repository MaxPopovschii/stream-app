import { useState, useEffect } from 'react';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  duration: number;
  rating: number;
  genres: string[];
}

export default function Browse() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [trending, setTrending] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];

  useEffect(() => {
    fetchVideos();
    fetchTrending();
  }, [selectedGenre]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const endpoint = selectedGenre === 'all' 
        ? '/api/videos/videos?limit=20'
        : `/api/videos/videos/genre/${selectedGenre}?limit=20`;
      
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
      const response = await api.get('/api/videos/videos/trending?limit=10');
      setTrending(response.data.videos || []);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const handleAddToWatchlist = async (videoId: string) => {
    try {
      await api.post(`/api/users/users/watchlist/${videoId}`);
      alert('Added to watchlist!');
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    }
  };

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

        {/* Genre Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedGenre === genre
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter hover:bg-dark-light'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400">Loading videos...</p>
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
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No videos found</p>
          </div>
        )}
      </div>
    </div>
  );
}
