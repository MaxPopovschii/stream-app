import { Link } from 'react-router-dom';
import { FiPlay, FiPlus } from 'react-icons/fi';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: number;
  rating?: number;
}

interface VideoCardProps {
  video: Video;
  onAddToWatchlist?: (videoId: string) => void;
}

export default function VideoCard({ video, onAddToWatchlist }: VideoCardProps) {
  return (
    <div className="card group relative">
      <img
        src={video.thumbnail || '/placeholder.jpg'}
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-3">
          <Link
            to={`/watch/${video.id}`}
            className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition"
          >
            <FiPlay size={20} />
          </Link>
          {onAddToWatchlist && (
            <button
              onClick={() => onAddToWatchlist(video.id)}
              className="bg-dark-lighter p-3 rounded-full hover:bg-dark transition"
            >
              <FiPlus size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{video.title}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
          {video.duration && <span>{video.duration} min</span>}
          {video.rating && <span>⭐ {video.rating}</span>}
        </div>
      </div>
    </div>
  );
}
