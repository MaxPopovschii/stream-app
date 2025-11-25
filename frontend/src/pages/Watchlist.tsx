import { useState, useEffect } from 'react';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/watchlist');
      setWatchlist(response.data);
      
      // Fetch video details for each item
      const videoPromises = response.data.map((item: any) =>
        api.get(`/videos/${item.videoId}`).catch(() => null)
      );
      
      const videoResponses = await Promise.all(videoPromises);
      const videoData = videoResponses
        .filter((res) => res !== null)
        .map((res) => res?.data);
      
      setVideos(videoData);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (videoId: string) => {
    try {
      await api.delete(`/users/watchlist/${videoId}`);
      fetchWatchlist();
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="relative">
                <VideoCard
                  video={{
                    id: video._id,
                    title: video.title,
                    thumbnail: video.thumbnail,
                    duration: video.duration,
                    rating: video.rating,
                    description: video.description,
                    releaseYear: video.releaseYear,
                    genres: video.genres
                  }}
                />
                <button
                  onClick={() => handleRemove(video._id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-4">Your watchlist is empty</p>
            <a href="/browse" className="btn-primary inline-block">
              Browse Videos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
