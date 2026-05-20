"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StepFooter } from "@/components/dashboard/create/StepFooter";
import { Sparkles, Palette, Eye } from "lucide-react";
import type { CreateSeriesData } from "@/app/dashboard/create/page";

// Extend CreateSeriesData specifically for the local typing
export interface CreateSeriesDataWithVisuals extends CreateSeriesData {
  visualStyle: string;
}

interface VisualSelectionProps {
  initialData: CreateSeriesData;
  onNext: (data: Partial<CreateSeriesData>) => void;
  onBack: () => void;
}

const VISUAL_STYLES = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    description: "Glowing neons, rainy futuristic cityscapes, and high contrast cyber aesthetics.",
    previewImg: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=600&auto=format&fit=crop",
    color: "from-pink-500 to-purple-600",
  },
  {
    id: "anime",
    name: "Anime & Manga",
    description: "Vibrant hand-drawn visuals, saturated colors, and highly expressive cartoon artistry.",
    previewImg: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    color: "from-amber-400 to-rose-500",
  },
  {
    id: "cinematic",
    name: "Epic Cinematic",
    description: "Dramatic low-key lighting, photorealistic textures, and rich blockbuster atmosphere.",
    previewImg: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "3d-render",
    name: "Sleek 3D Render",
    description: "Smooth geometric figures, toy-like glossy plastics, and vibrant digital dioramas.",
    previewImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    color: "from-teal-400 to-emerald-600",
  },
  {
    id: "retro",
    name: "Vintage Retro",
    description: "Warm film grain, nostalgic polaroid coloring, and authentic classic vibes.",
    previewImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    color: "from-orange-400 to-amber-600",
  },
];

export const VisualSelection = ({ initialData, onNext, onBack }: VisualSelectionProps) => {
  // Coerce the initialData to match our visual data structure
  const initialVisual = (initialData as any).visualStyle || "";
  const [selectedStyle, setSelectedStyle] = useState<string>(initialVisual);

  const handleNext = () => {
    onNext({
      ...initialData,
      visualStyle: selectedStyle,
    } as any);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
          Visual Style
        </h2>
        <p className="text-slate-400 mt-2">
          Select the artistic visual generation style that matches your shorts channel brand.
        </p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex-1 flex flex-col min-h-0">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-6 shrink-0">
          <Palette className="w-4 h-4 text-purple-400" />
          Choose an Artistic Theme ({VISUAL_STYLES.length})
        </label>

        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VISUAL_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;

              return (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col h-[320px]",
                    isSelected
                      ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]"
                      : "border-white/5 hover:border-white/20 hover:scale-[1.02]"
                  )}
                >
                  {/* Style Preview Image Background */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={style.previewImg}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay badge when selected */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-20 bg-purple-500 text-white rounded-full p-1.5 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        <Sparkles className="w-4 h-4 fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Glassmorphic Lower Details Section */}
                  <div className="flex-1 bg-slate-900 p-4 flex flex-col justify-between border-t border-white/5">
                    <div>
                      <h3 className={cn(
                        "font-bold text-lg leading-tight transition-colors duration-200",
                        isSelected ? "text-purple-300" : "text-slate-200"
                      )}>
                        {style.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {style.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-widest bg-linear-to-r px-2.5 py-1 rounded-md text-white shadow-sm",
                        style.color
                      )}>
                        Style Applied
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        Preview HD
                      </div>
                    </div>
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
          isNextDisabled={!selectedStyle}
          showBack
        />
      </div>
    </div>
  );
};
