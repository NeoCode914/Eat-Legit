import { useState, useCallback, useEffect, useRef } from "react";
import type { Reel } from "../types";
import api from "../api/axios";
import ReelCard from "../components/ReelCard";
import Navbar from "../components/Navbar";
import { Loader2, Wifi, Play } from "lucide-react";

// ─── Seed data (displayed until backend returns real videos) ──────────────────

const DEMO_REELS: Reel[] = [
  {
    id: "1",
    videoUrl:
      "https://www.pexels.com/download/video/36695819/",
    title: "Crispy Korean Fried Chicken 🍗",
    description:
      "Double-fried for the ultimate crunch. Served with our house-made gochujang dipping sauce.",
    likes: 4821,
    isLiked: false,
    isSaved: false,
    partnerName: "Seoul Kitchen",
    createdAt: "2026-04-01",
  },
  {
    id: "2",
    videoUrl:
      "https://www.pexels.com/download/video/6096030/",
    title: "Authentic Wood-Fired Pizza 🍕",
    description:
      "Neapolitan dough, San Marzano tomatoes, fresh buffalo mozzarella. Fired at 900°F.",
    likes: 3109,
    isLiked: false,
    isSaved: false,
    partnerName: "Napoli House",
    createdAt: "2026-04-02",
  },
  {
    id: "3",
    videoUrl:
      "https://www.pexels.com/download/video/31745143/",
    title: "Creamy Ramen Bowl 🍜",
    description:
      "Tonkotsu broth simmered for 18 hours. Topped with chashu pork, soft egg & nori.",
    likes: 6534,
    isLiked: false,
    isSaved: false,
    partnerName: "Ramen Republic",
    createdAt: "2026-04-03",
  },
  {
    id: "4",
    videoUrl:
      "https://media.w3.org/2010/05/video/movie_300.mp4",
    title: "Butter Chicken Masterclass 🍛",
    description:
      "Slow-cooked in a rich tomato-cream sauce with hand-ground spices. Served with garlic naan.",
    likes: 5207,
    isLiked: false,
    isSaved: false,
    partnerName: "Spice Garden",
    createdAt: "2026-04-03",
  },
  {
    id: "5",
    videoUrl:
      "https://www.pexels.com/download/video/34174970/",
    title: "Lava Molten Chocolate Cake 🍫",
    description:
      "Warm center, crisp shell. Made fresh per order with Belgian dark chocolate.",
    likes: 8102,
    isLiked: false,
    isSaved: false,
    partnerName: "Dessert Lab",
    createdAt: "2026-04-04",
  },
];

// ─── Share Toast ──────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  visible: boolean;
}

function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-medium shadow-2xl transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReelsFeed() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchReels() {
      try {
        const { data } = await api.get<Reel[]>("/api/food/videos");
        setReels(data || []);
      } catch (error) {
        console.error("Failed to load reels from DB:", error);
        setReels([]);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchReels();
  }, []);
  const [toast, setToast] = useState<ToastProps>({ message: "", visible: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast({ message, visible: false });
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // ── Intersection Observer to detect active reel ────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset["reelIndex"] ?? 0);
            setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 }
    );

    const slides = container.querySelectorAll("[data-reel-index]");
    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [reels]);

  const handleLike = useCallback((id: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  }, []);

  const handleSave = useCallback((id: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isSaved: !r.isSaved } : r
      )
    );
    const reel = reels.find((r) => r.id === id);
    if (reel) {
      showToast(reel.isSaved ? "Removed from saved" : "Saved to your collection ✓");
    }
  }, [reels, showToast]);

  const handleShare = useCallback(
    async (reel: Reel) => {
      const shareData: ShareData = {
        title: reel.title,
        text: reel.description,
        url: window.location.href,
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch {
          // user cancelled share
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard 📋");
      }
    },
    [showToast]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="text-orange-400 animate-spin" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Feed Container */}
      <div className="pt-15 h-screen">
        {/* Scroll container */}
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              data-reel-index={index}
              className="h-full flex items-center justify-center snap-center snap-always px-4 py-4"
            >
              <div className="relative w-full max-w-sm h-full max-h-[85vh]">
                <ReelCard
                  reel={reel}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShare={handleShare}
                  isActive={activeIndex === index}
                />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {reels.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center">
                <Play size={36} className="text-orange-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-white text-xl font-bold">No reels yet</h2>
                <p className="text-white/40 text-sm max-w-xs">
                  Food partners haven&apos;t uploaded any reels yet. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reel counter dots */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-30">
        {reels.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${i === activeIndex
              ? "w-1 h-6 bg-orange-400"
              : "w-1 h-1.5 bg-white/20"
              }`}
          />
        ))}
      </div>

      {/* Network status - offline indicator */}
      {!navigator.onLine && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/90 text-white text-xs font-medium">
          <Wifi size={12} />
          You&apos;re offline
        </div>
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
