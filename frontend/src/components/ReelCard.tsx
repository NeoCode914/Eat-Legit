import { useState, useRef, useCallback } from "react";
import type { Reel } from "../types";
import { Heart, Bookmark, Share2, Play, Pause, Volume2, VolumeX, ChefHat } from "lucide-react";

interface ReelCardProps {
  reel: Reel;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (reel: Reel) => void;
  isActive: boolean;
}

export default function ReelCard({ reel, onLike, onSave, onShare, isActive }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      void videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted((m) => !m);
  }, [isMuted]);

  // Format large numbers
  const formatCount = (n: number): string => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <div
      className="relative w-full h-full shrink-0 rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl cursor-pointer select-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
      role="button"
      tabIndex={0}
      aria-label={`Reel: ${reel.title}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") togglePlay(); }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        autoPlay={isActive}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />

      {/* Play/Pause Indicator */}
      {showControls && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transition: "opacity 200ms" }}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            {isPlaying ? (
              <Pause size={28} className="text-white" fill="white" />
            ) : (
              <Play size={28} className="text-white" fill="white" />
            )}
          </div>
        </div>
      )}

      {/* Mute Toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all z-10 cursor-pointer"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-none">
        {/* Partner badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
            <ChefHat size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm drop-shadow">{reel.partnerName}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
            Verified
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-white font-bold text-base leading-tight drop-shadow line-clamp-1">
            {reel.title}
          </h3>
          <p className="text-white/70 text-xs leading-relaxed drop-shadow line-clamp-2">
            {reel.description}
          </p>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div
        className="absolute right-3 bottom-32 flex flex-col gap-4 items-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Like */}
        <button
          onClick={() => onLike(reel.id)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          aria-label={reel.isLiked ? "Unlike reel" : "Like reel"}
          id={`reel-like-${reel.id}`}
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
              reel.isLiked
                ? "bg-red-500/30 shadow-lg shadow-red-500/30"
                : "bg-white/10 group-hover:bg-white/20"
            }`}
          >
            <Heart
              size={20}
              className={`transition-all duration-200 ${
                reel.isLiked ? "text-red-400 scale-110" : "text-white"
              }`}
              fill={reel.isLiked ? "currentColor" : "none"}
            />
          </div>
          <span className="text-white text-[10px] font-semibold tabular-nums drop-shadow">
            {formatCount(reel.likes)}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={() => onSave(reel.id)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          aria-label={reel.isSaved ? "Unsave reel" : "Save reel"}
          id={`reel-save-${reel.id}`}
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
              reel.isSaved
                ? "bg-orange-500/30 shadow-lg shadow-orange-500/30"
                : "bg-white/10 group-hover:bg-white/20"
            }`}
          >
            <Bookmark
              size={20}
              className={`transition-all duration-200 ${
                reel.isSaved ? "text-orange-400 scale-110" : "text-white"
              }`}
              fill={reel.isSaved ? "currentColor" : "none"}
            />
          </div>
          <span className="text-white text-[10px] font-semibold drop-shadow">Save</span>
        </button>

        {/* Share */}
        <button
          onClick={() => onShare(reel)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          aria-label="Share reel"
          id={`reel-share-${reel.id}`}
        >
          <div className="w-11 h-11 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all duration-200">
            <Share2 size={18} className="text-white" />
          </div>
          <span className="text-white text-[10px] font-semibold drop-shadow">Share</span>
        </button>
      </div>
    </div>
  );
}
