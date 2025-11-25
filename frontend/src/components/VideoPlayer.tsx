import { useState, useRef, useEffect, useCallback } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSettings } from 'react-icons/fi';
import { formatTime as formatTimeUtil } from '../utils/formatTime';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  onProgress?: (progress: number) => void;
  initialProgress?: number;
}

export default function VideoPlayer({ url, thumbnail, onProgress, initialProgress = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress && duration > 0) {
        onProgress((video.currentTime / duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialProgress > 0) {
        video.currentTime = (initialProgress / 100) * video.duration;
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [duration, initialProgress, onProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(-0.1);
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const changeVolume = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const updateCurrentTimeFromRatio = useCallback((ratio: number) => {
    if (!videoRef.current || duration === 0 || Number.isNaN(duration)) return;
    const clamped = Math.min(Math.max(ratio, 0), 1);
    const newTime = clamped * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setScrubTime(newTime);
    if (onProgress) {
      onProgress((newTime / duration) * 100);
    }
  }, [duration, onProgress]);

  const handleScrubStart = useCallback((clientX: number) => {
    if (!progressRef.current || !videoRef.current || duration === 0 || Number.isNaN(duration)) return;
    const rect = progressRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    wasPlayingRef.current = !videoRef.current.paused;
    videoRef.current.pause();
    setIsScrubbing(true);
    updateCurrentTimeFromRatio(ratio);
  }, [duration, updateCurrentTimeFromRatio]);

  const handleScrubMove = useCallback((clientX: number) => {
    if (!progressRef.current || !isScrubbing) return;
    const rect = progressRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    updateCurrentTimeFromRatio(ratio);
  }, [isScrubbing, updateCurrentTimeFromRatio]);

  const handleScrubEnd = useCallback(() => {
    if (!videoRef.current) return;
    setIsScrubbing(false);
    setScrubTime(null);
    if (wasPlayingRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isScrubbing) {
        handleScrubMove(event.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isScrubbing) {
        handleScrubEnd();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleScrubEnd, handleScrubMove, isScrubbing]);

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (isScrubbing && event.touches[0]) {
        handleScrubMove(event.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      if (isScrubbing) {
        handleScrubEnd();
      }
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleScrubEnd, handleScrubMove, isScrubbing]);

  const activeTime = scrubTime ?? currentTime;
  const progressPercent = duration > 0 ? (activeTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={thumbnail}
        onClick={togglePlay}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay}>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition">
            <FiPlay size={48} className="ml-2" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="group/progress relative mb-4 h-2 w-full cursor-pointer rounded-full bg-white/20"
          onMouseDown={(e) => {
            e.preventDefault();
            handleScrubStart(e.clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              e.preventDefault();
              handleScrubStart(e.touches[0].clientX);
            }
          }}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(activeTime)}
        >
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all group-hover/progress:h-3"
            style={{ width: `${progressPercent}%` }}
          >
            {(isScrubbing || progressPercent > 0) && (
              <div
                className={`absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 transition-all ${
                  isScrubbing ? 'opacity-100' : 'opacity-0 group-hover/progress:opacity-100'
                }`}
              >
                {isScrubbing && (
                  <span className="rounded-md bg-black/80 px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
                    {formatTimeUtil(activeTime)}
                  </span>
                )}
                <span className={`block h-4 w-4 rounded-full bg-white shadow-lg ${isScrubbing ? 'scale-110' : ''}`}></span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="hover:scale-110 transition-transform"
            >
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="text-sm hover:text-primary transition-colors"
            >
              -10s
            </button>
            <button
              onClick={() => skip(10)}
              className="text-sm hover:text-primary transition-colors"
            >
              +10s
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="hover:text-primary transition-colors">
                {isMuted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) videoRef.current.volume = val;
                  if (val > 0) setIsMuted(false);
                }}
                className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100"
              />
            </div>

            {/* Time */}
            <span className="text-sm text-gray-300">
              {formatTimeUtil(currentTime)} / {formatTimeUtil(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <FiSettings size={20} />
                <span className="text-sm">{quality}</span>
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 glass rounded-2xl p-2 min-w-[120px]">
                  {['auto', '1080p', '720p', '480p', '360p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-xl hover:bg-white/10 transition-colors ${
                        quality === q ? 'text-primary' : ''
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-primary transition-colors"
            >
              <FiMaximize size={20} />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Shortcuts: Space (play/pause) | ← → (skip) | ↑ ↓ (volume) | M (mute) | F (fullscreen)
        </div>
      </div>
    </div>
  );
}
