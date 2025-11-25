import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';
import VideoPlayer from '../components/VideoPlayer';
import Rating from '../components/Rating';
import { FiHeart, FiPlus, FiShare2 } from 'react-icons/fi';

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
  const [liked, setLiked] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
      fetchSimilarVideos();
      trackView();
    }
  }, [videoId]);

  const fetchVideoDetails = async () => {
    try {
      const response = await api.get(`/videos/${videoId}`);
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
      await api.post(`/videos/${videoId}/view`);
      await api.post(`/users/history/${videoId}`, {
        duration: '0',
        progress: '0'
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/videos/${videoId}/like`);
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await api.delete(`/users/watchlist/${videoId}`);
      } else {
        await api.post(`/users/watchlist/${videoId}`);
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: video?.title,
        text: video?.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleProgress = (prog: number) => {
    setProgress(prog);
    // Save progress to backend
    if (videoId && prog > 5) {
      api.post(`/users/history/${videoId}`, {
        duration: video?.duration.toString() || '0',
        progress: prog.toString()
      }).catch(console.error);
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
    <div className="min-h-screen bg-dark">
      {/* Video Player */}
      <div className="w-full bg-black">
        <div className="max-w-[1920px] mx-auto">
          <VideoPlayer
            url={video.videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            thumbnail={video.thumbnail}
            onProgress={handleProgress}
            initialProgress={progress}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Title and Year */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{video.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-400">
              <span className="px-3 py-1 glass rounded-full text-sm">{video.releaseYear}</span>
              <span className="px-3 py-1 glass rounded-full text-sm">
                {Math.floor(video.duration / 60)}h {video.duration % 60}m
              </span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="font-semibold">{video.rating}</span>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                {video.genres[0]?.toUpperCase()}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed mb-8">{video.description}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleLike}
                className={`btn-primary flex items-center gap-2 ${
                  liked ? 'bg-gradient-to-r from-pink-500 to-red-500' : ''
                }`}
              >
                <FiHeart size={20} fill={liked ? 'currentColor' : 'none'} />
                {liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={handleWatchlist}
                className={`btn-secondary flex items-center gap-2 ${
                  inWatchlist ? 'bg-white/20' : ''
                }`}
              >
                <FiPlus size={20} />
                {inWatchlist ? 'In My List' : 'Add to List'}
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary flex items-center gap-2"
              >
                <FiShare2 size={20} />
                Share
              </button>
            </div>

            {/* Rating */}
            <div className="mb-10">
              <h3 className="text-sm text-gray-500 mb-3 uppercase tracking-wide">Rate this video</h3>
              <Rating videoId={videoId || ''} />
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 glass rounded-3xl p-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Director</h3>
                <p className="text-lg font-medium">{video.director}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {video.genres.map((genre, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm capitalize">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Cast</h3>
                <p className="text-gray-300">{video.cast.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full rounded-2xl shadow-elegant mb-4"
              />
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Progress</span>
                  <span className="text-primary font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Videos */}
        {similar.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">More Like This</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similar.map((sim) => (
                <VideoCard
                  key={sim.videoId}
                  video={{
                    id: sim.videoId,
                    title: sim.title,
                    thumbnailUrl: sim.thumbnail,
                    duration: sim.duration,
                    rating: sim.rating
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
