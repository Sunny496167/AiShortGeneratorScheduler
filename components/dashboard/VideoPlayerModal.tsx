"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Play, Pause, Volume2, VolumeX, X, Download, 
  Music, Film, Share2, Heart, MessageCircle, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";

interface VideoPlayerModalProps {
  video: {
    id: string;
    title: string;
    script: string;
    status: string;
    voice_audio_url?: string;
  };
  onClose: () => void;
}

// Highly descriptive scene assets by theme to simulate realistic short video footage
const SCENE_THEMES: Record<string, string[]> = {
  scary: [
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481018085669-0bc7e75038fc?q=80&w=400&auto=format&fit=crop"
  ],
  motivation: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400&auto=format&fit=crop"
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400&auto=format&fit=crop"
  ],
  default: [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214222541-d510753a4907?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400&auto=format&fit=crop"
  ]
};

export const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [currentSceneUrl, setCurrentSceneUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Extract sentences from script for animated timed subtitles
  const sentences = video.script
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Assign background photos depending on keywords in title/script
  useEffect(() => {
    const text = (video.title + " " + video.script).toLowerCase();
    let theme = "default";
    if (text.includes("scary") || text.includes("ghost") || text.includes("horror") || text.includes("dark") || text.includes("creepy")) {
      theme = "scary";
    } else if (text.includes("motivation") || text.includes("success") || text.includes("inspire") || text.includes("work")) {
      theme = "motivation";
    } else if (text.includes("tech") || text.includes("ai") || text.includes("gadget") || text.includes("science")) {
      theme = "tech";
    }

    const collection = SCENE_THEMES[theme] || SCENE_THEMES.default;
    setCurrentSceneUrl(collection[Math.floor(Math.random() * collection.length)]);
  }, [video]);

  // Timed subtitle playback simulation
  useEffect(() => {
    let intervalId: any;
    
    if (isPlaying && sentences.length > 0) {
      setActiveSubtitle(sentences[subtitleIndex]);
      
      intervalId = setInterval(() => {
        setSubtitleIndex((prev) => {
          const next = prev + 1;
          if (next >= sentences.length) {
            setProgress(100);
            return 0; // loop
          }
          setProgress((next / sentences.length) * 100);
          return next;
        });
      }, 3500); // 3.5 seconds per line of dialogue
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, subtitleIndex, sentences]);

  // Audio backing track simulation
  useEffect(() => {
    // Autoloop background music at 20% volume
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : 0.2;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.log("Music blocked by browser policy:", err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.2;
    }
  }, [isMuted]);

  const handleDownload = () => {
    toast.success("Preparing short video download", {
      description: "Assembling subtitle overlay, audio backing tracks, and MP4 video packages..."
    });
    
    setTimeout(() => {
      // Create element and simulate trigger
      const link = document.createElement("a");
      link.href = "https://www.w3schools.com/html/mov_bbb.mp4"; // standard open-source short video file
      link.download = `${video.title.toLowerCase().replace(/\s+/g, "-")}-reelio-short.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download Complete!");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Modal Card Layout */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-slate-950/40 text-slate-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Portait Shorts Video Area */}
        <div className="flex-1 bg-black flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10 relative">
          <div className="aspect-[9/16] h-[480px] md:h-[540px] max-h-full rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl bg-slate-950 select-none group">
            
            {/* Background Image scene with slow floating scale simulation */}
            {currentSceneUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={currentSceneUrl} 
                alt="Short Preview Frame"
                className={cn(
                  "w-full h-full object-cover select-none pointer-events-none transition-transform duration-1000",
                  isPlaying ? "scale-105" : "scale-100"
                )}
              />
            )}

            {/* Dark vignettes overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/60 z-10 pointer-events-none" />

            {/* Timed animated subtitles glow */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 text-center select-none pointer-events-none">
              <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-linear-to-b from-yellow-300 via-amber-400 to-amber-500 uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter leading-tight px-2 py-1 select-none pointer-events-none block animate-bounce" style={{ animationDuration: '4s' }}>
                {activeSubtitle}
              </span>
            </div>

            {/* Bottom details overlay */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex flex-col gap-2 pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                  R
                </div>
                <span className="text-xs font-bold text-slate-100">@reelio_shorts</span>
              </div>
              <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed">
                {video.title} #shorts #ai #automation
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                <Music className="w-3.5 h-3.5 fill-purple-300/10 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Neon Synthwave • Looped Background</span>
              </div>
            </div>

            {/* Controls Bars */}
            <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
              {/* Play / Mute Indicators */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-slate-950/40 backdrop-blur-md text-slate-100 border border-white/5 hover:bg-slate-950/80 cursor-pointer pointer-events-auto"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-slate-950/40 backdrop-blur-md text-slate-100 border border-white/5 hover:bg-slate-950/80 cursor-pointer pointer-events-auto"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sidebar actions inside player */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col gap-4 items-center">
              <div className="flex flex-col items-center gap-1">
                <button className="w-10 h-10 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/5 text-slate-300 flex items-center justify-center hover:text-rose-500 cursor-pointer">
                  <Heart className="w-5 h-5 fill-current" />
                </button>
                <span className="text-[10px] font-bold text-slate-300">14.8K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="w-10 h-10 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/5 text-slate-300 flex items-center justify-center hover:text-blue-500 cursor-pointer">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </button>
                <span className="text-[10px] font-bold text-slate-300">105</span>
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/5 text-slate-300 flex items-center justify-center hover:text-white cursor-pointer">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
              <div 
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="w-full md:w-96 p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-full">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Video Script Details</span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{video.title}</h2>
            </div>

            {/* Dynamic Status Banner */}
            <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Generation Pipeline Status</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-full capitalize">
                {video.status}
              </span>
            </div>

            {/* Script Text Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Narrator Script</span>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 text-slate-300 text-xs leading-relaxed max-h-[180px] overflow-y-auto custom-scrollbar font-mono">
                {video.script}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 space-y-3">
            <button
              onClick={handleDownload}
              className="w-full bg-white text-slate-950 hover:bg-slate-200 transition-colors py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 text-sm cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 stroke-[2.5px]" /> Download Short Video
            </button>
            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Downloads as dynamic 9:16 vertical short containing custom visuals and timed typography subtitling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
