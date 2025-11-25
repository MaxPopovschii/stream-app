import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import api from '../lib/api';
import { formatDuration } from '../utils/formatTime';

interface WatchHistoryItem {
  videoId: string;
  progress: string;
  duration: string;
  watchedAt: string;
}

interface VideoData {
  _id: string;
  title: string;
  thumbnail: string;
  duration: number;
}

interface ContinueWatchingVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  progress: number;
  duration: number;
  watchedAt: string;
}

export default function ContinueWatching() {
  const [videos, setVideos] = useState<ContinueWatchingVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContinueWatching();
  }, []);

  const fetchContinueWatching = async () => {
    try {
      const response = await api.get('/users/history');
      const history: WatchHistoryItem[] = response.data || [];
      
      // Filter videos with progress between 5% and 95%
      const inProgress = history.filter((h) => {
        const prog = parseFloat(h.progress || '0');
        return prog > 5 && prog < 95;
      });
      
      // Fetch video details for each item
      const videoPromises = inProgress.slice(0, 6).map(async (item) => {
        try {
          const videoRes = await api.get(`/videos/${item.videoId}`);
          const videoData: VideoData = videoRes.data;
          return {
            videoId: item.videoId,
            title: videoData.title,
            thumbnail: videoData.thumbnail,
            progress: parseFloat(item.progress || '0'),
            duration: videoData.duration,
            watchedAt: item.watchedAt
          };
        } catch (err) {
          console.error(`Failed to fetch video ${item.videoId}:`, err);
          return null;
        }
      });
      
      const videoResults = await Promise.all(videoPromises);
      const validVideos = videoResults.filter((v): v is ContinueWatchingVideo => v !== null);
      
      setVideos(validVideos);
    } catch (error) {
      console.error('Failed to fetch continue watching:', error);
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
      return (
        <div className="py-8">
          <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse"></div>
        </div>
      );
    }
  
    if (videos.length === 0) return null;
  
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Continue Watching</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {videos.map((video) => (
            <Link
              key={video.videoId}
              to={`/watch/${video.videoId}`}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
  
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FiPlay size={20} className="ml-1" />
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="mt-2">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round(video.progress)}% • {formatDuration(video.duration * (1 - video.progress / 100))} left
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }
