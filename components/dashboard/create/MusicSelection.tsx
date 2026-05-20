"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { StepFooter } from "@/components/dashboard/create/StepFooter";
import { Play, Pause, Music, Volume2, Sparkles, Disc } from "lucide-react";
import type { CreateSeriesData } from "@/app/dashboard/create/page";

interface MusicSelectionProps {
  initialData: CreateSeriesData;
  onNext: (data: Partial<CreateSeriesData>) => void;
  onBack: () => void;
}

const SOUNDTRACKS = [
  {
    id: "lofi",
    name: "Lofi Chill Beats",
    genre: "Relaxing / Chillout",
    duration: "2:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "Relaxed hip-hop grooves and vinyl crackles, perfect for stories, guides, and study logs.",
  },
  {
    id: "cinematic",
    name: "Cinematic Horizons",
    genre: "Epic / Dramatic",
    duration: "3:10",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "Orchestral surges, deep strings, and sweeping winds. Best for inspirational and historical narratives.",
  },
  {
    id: "cyber",
    name: "Neon Synthwave",
    genre: "Upbeat / Electronic",
    duration: "2:55",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description: "Retro 80s synthesizers, driving drums, and energetic tempos. Excellent for tech updates and gaming shorts.",
  },
  {
    id: "creepy",
    name: "Haunted Whispers",
    genre: "Dark / Ambient",
    duration: "3:05",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    description: "Eerie background drones, cold winds, and low metallic rumbles. Ideal for scary stories and horror niches.",
  },
  {
    id: "none",
    name: "Voice Only (No Music)",
    genre: "Minimalist",
    duration: "0:00",
    url: "",
    description: "Pure AI-generated voice-over narration without any background instrumental sound.",
  },
];

export const MusicSelection = ({ initialData, onNext, onBack }: MusicSelectionProps) => {
  const initialMusic = (initialData as any).musicStyle || "";
  const [selectedMusic, setSelectedMusic] = useState<string>(initialMusic);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSelect = (id: string) => {
    setSelectedMusic(id);
  };

  const togglePlay = (e: React.MouseEvent, soundtrack: typeof SOUNDTRACKS[0]) => {
    e.stopPropagation(); // Stop trigger select

    if (soundtrack.id === "none") return;

    if (playingId === soundtrack.id) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      // Play
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(soundtrack.url);
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(err => console.log("Audio failed to play:", err));
      setPlayingId(soundtrack.id);

      audioRef.current.onended = () => {
        setPlayingId(null);
      };
    }
  };

  const handleNext = () => {
    onNext({
      ...initialData,
      musicStyle: selectedMusic,
    } as any);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
          Background Music
        </h2>
        <p className="text-slate-400 mt-2">
          Add an atmospheric soundtrack to make your video shorts engaging and fully cinematic.
        </p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Music className="w-4 h-4 text-blue-400" />
            Soundtracks Catalog ({SOUNDTRACKS.length})
          </label>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            50% Volume Autoplay
          </div>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          <div className="space-y-3.5">
            {SOUNDTRACKS.map((track) => {
              const isSelected = selectedMusic === track.id;
              const isPlaying = playingId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelect(track.id)}
                  className={cn(
                    "p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                    isSelected
                      ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.01]"
                      : "bg-slate-800/40 border-white/5 hover:border-white/15 hover:bg-slate-800/80"
                  )}
                >
                  {/* Subtle disc overlay */}
                  {isSelected && (
                    <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 opacity-5 pointer-events-none group-hover:rotate-45 transition-transform duration-1000">
                      <Disc className="w-48 h-48 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                  )}

                  <div className="flex items-start md:items-center gap-4">
                    {/* Play/Pause Button */}
                    {track.id !== "none" ? (
                      <button
                        onClick={(e) => togglePlay(e, track)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                          isPlaying
                            ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110"
                            : "bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
                        )}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </button>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 text-slate-500">
                        <Music className="w-5 h-5" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-bold text-lg leading-none transition-colors duration-200",
                          isSelected ? "text-purple-300" : "text-slate-200"
                        )}>
                          {track.name}
                        </h3>
                        {isSelected && (
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {track.genre} {track.duration !== "0:00" && `• ${track.duration}`}
                      </p>
                      <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xl pt-1">
                        {track.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center md:justify-end shrink-0">
                    <span className={cn(
                      "text-xs px-3 py-1.5 rounded-full font-bold border",
                      isSelected
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        : "bg-white/5 text-slate-400 border-white/5 group-hover:border-white/10"
                    )}>
                      {isSelected ? "Selected Soundtrack" : "Select Track"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 shrink-0">
        <StepFooter
          onNext={handleNext}
          onBack={onBack}
          isNextDisabled={!selectedMusic}
          showBack
        />
      </div>
    </div>
  );
};
