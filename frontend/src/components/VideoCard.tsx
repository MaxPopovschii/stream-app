import { Link } from 'react-router-dom';
import { FiPlay, FiPlus, FiStar } from 'react-icons/fi';
import { formatDuration } from '../utils/formatTime';

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  duration?: number;
  rating?: number;
  releaseYear?: number;
  genres?: string[];
  description?: string;
}

interface VideoCardProps {
  video: Video;
  onAddToWatchlist?: (videoId: string) => void;
}

export default function VideoCard({ video, onAddToWatchlist }: VideoCardProps) {
  const thumbnailSrc = video.thumbnailUrl || video.thumbnail || '/placeholder.jpg';
  const primaryGenre = Array.isArray(video.genres) && video.genres.length > 0 ? video.genres[0] : undefined;
  const metaPieces = [
    video.releaseYear ? `${video.releaseYear}` : undefined,
    typeof video.duration === 'number' && video.duration > 0 ? formatDuration(video.duration) : undefined,
    primaryGenre ? primaryGenre.replace(/_/g, ' ') : undefined
  ].filter(Boolean) as string[];

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-dark-lighter/40 shadow-elegant-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={thumbnailSrc}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {typeof video.rating === 'number' && video.rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              <FiStar className="text-secondary" />
              {video.rating.toFixed(1)}
            </span>
          )}
          {metaPieces.length > 0 && (
            <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-200 backdrop-blur">
              {metaPieces.join(' • ')}
            </span>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-3">
            <Link
              to={`/watch/${video.id}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-elegant transition-transform duration-200 hover:scale-110"
            >
              <FiPlay size={22} />
            </Link>
            {onAddToWatchlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToWatchlist(video.id);
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-lg transition-all duration-200 hover:scale-110 hover:bg-white/30"
              >
                <FiPlus size={22} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-primary">
          {video.title}
        </h3>
        {video.description && (
          <p className="line-clamp-2 text-sm text-gray-400">{video.description}</p>
        )}
        {metaPieces.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {metaPieces.map((piece) => (
              <span key={piece} className="rounded-full border border-white/10 px-3 py-1">
                {piece}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
