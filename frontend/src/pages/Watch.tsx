import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';

interface VideoDetails {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  rating: number;
  genres: string[];
  cast: string[];
  director: string;
  releaseYear: number;
}

export default function Watch() {
  const { videoId } = useParams();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
      fetchSimilarVideos();
      trackView();
    }
  }, [videoId]);

  const fetchVideoDetails = async () => {
    try {
      const response = await api.get(`/api/videos/videos/${videoId}`);
      setVideo(response.data);
    } catch (error) {
      console.error('Failed to fetch video details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarVideos = async () => {
    try {
      const response = await api.get(`/api/recommendations/recommendations/similar/${videoId}`);
      setSimilar(response.data.similar || []);
    } catch (error) {
      console.error('Failed to fetch similar videos:', error);
    }
  };

  const trackView = async () => {
    try {
      await api.post(`/api/videos/videos/${videoId}/view`);
      await api.post(`/api/users/users/history/${videoId}`, {
        duration: '0',
        progress: '0'
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/api/videos/videos/${videoId}/like`);
      alert('Liked!');
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-xl text-gray-400">Video not found</p>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Video Player */}
      <div className="w-full bg-black">
        <div className="max-w-7xl mx-auto">
          <ReactPlayer
            url={video.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            width="100%"
            height="600px"
            controls
            playing={false}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{video.title}</h1>
            
            <div className="flex items-center space-x-6 mb-6 text-gray-400">
              <span>{video.releaseYear}</span>
              <span>{video.duration} min</span>
              <span>⭐ {video.rating}</span>
            </div>

            <p className="text-lg text-gray-300 mb-6">{video.description}</p>

            <div className="flex space-x-4 mb-8">
              <button onClick={handleLike} className="btn-primary">
                👍 Like
              </button>
              <button className="btn-secondary">
                + My List
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              <div>
                <span className="text-gray-500">Director: </span>
                {video.director}
              </div>
              <div>
                <span className="text-gray-500">Cast: </span>
                {video.cast.join(', ')}
              </div>
              <div>
                <span className="text-gray-500">Genres: </span>
                {video.genres.join(', ')}
              </div>
            </div>
          </div>

          <div>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Similar Videos */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similar.map((sim) => (
                <VideoCard
                  key={sim.videoId}
                  video={{
                    id: sim.videoId,
                    title: sim.title,
                    thumbnail: sim.thumbnail,
                    duration: sim.duration,
                    rating: parseFloat(sim.rating)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
