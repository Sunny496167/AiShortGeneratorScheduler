"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { StepFooter } from "@/components/dashboard/create/StepFooter";
import { 
  Sparkles, CheckCircle2, 
  Tv, Volume2, Image as ImageIcon, 
  Music, Calendar, Check, CreditCard, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import type { CreateSeriesData } from "@/app/dashboard/create/page";

interface ReviewSelectionProps {
  initialData: CreateSeriesData;
  onBack: () => void;
}

export const ReviewSelection = ({ initialData, onBack }: ReviewSelectionProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cast initialData to retrieve our extended fields safely
  const data = initialData as any;
  const nicheName = data.nicheType === "available" 
    ? (data.nicheId || "N/A").split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Custom Channel Topic";

  const frequencyMultiplier = data.scheduleFrequency === "daily" ? 30 
    : data.scheduleFrequency === "mwf" ? 12 
    : 4;

  const costCredits = frequencyMultiplier;

  const handleLaunch = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialData),
      });

      if (!response.ok) {
        throw new Error("Failed to create short series schedule");
      }

      toast.success("Short Series Created Successfully!", {
        description: `Your ${data.visualStyle || 'creative'} shorts series is scheduled at ${data.scheduleTime || '18:00'} daily!`,
      });

      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Generation Setup Failed", {
        description: err.message || "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
          Review & Launch
        </h2>
        <p className="text-slate-400 mt-2">
          Verify your automation parameters and initiate your autonomous short video series generator.
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Column: Summary Config Cards */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Niche Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/15">
                <Tv className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Short Channel Niche</span>
                <h4 className="font-bold text-slate-200 text-base leading-none">{nicheName}</h4>
                {data.nicheType === "custom" && (
                  <p className="text-xs text-slate-400 line-clamp-1 italic pt-0.5">{data.customNicheDescription}</p>
                )}
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Voice & Lang Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/15">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Language & AI Voice</span>
                <h4 className="font-bold text-slate-200 text-base leading-none">{data.voiceName || 'Swara'}</h4>
                <p className="text-xs text-slate-400 pt-0.5">{data.language || 'English'} • {data.voiceModel || 'Fonadalab'}</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Visuals Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/15">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Visual Art Direction</span>
                <h4 className="font-bold text-slate-200 text-base leading-none capitalize">{data.visualStyle || 'Cinematic'} Style</h4>
                <p className="text-xs text-slate-400 pt-0.5">High definition AI generated custom visuals and responsive styled captions.</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Soundtrack Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/15">
                <Music className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Background Soundtrack</span>
                <h4 className="font-bold text-slate-200 text-base leading-none capitalize">{data.musicStyle || 'Lofi'} Groove</h4>
                <p className="text-xs text-slate-400 pt-0.5">Autolooped backing soundtracks at balanced volume levels.</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Schedule Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/15">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Scheduler & Clock</span>
                <h4 className="font-bold text-slate-200 text-base leading-none capitalize">{data.scheduleFrequency || 'Daily'} Schedule</h4>
                <p className="text-xs text-slate-400 pt-0.5">Automated upload times set to {data.scheduleTime || '18:00'} daily.</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Right Column: Billing Invoice Receipt Card */}
        <div className="w-full lg:w-80 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col shrink-0">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-5 shrink-0 border-b border-white/5 pb-4">
            <CreditCard className="w-4 h-4 text-amber-500" />
            Launch Receipt Summary
          </label>

          <div className="flex-1 space-y-4 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Short Generation Rate</span>
              <span>1 credit / video</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Expected Monthly Yield</span>
              <span>{frequencyMultiplier} short videos</span>
            </div>

            <div className="border-t border-dashed border-white/10 my-4" />

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="font-semibold">Subtotal Credits</span>
              <span className="font-bold text-slate-100">{costCredits} credits/mo</span>
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
              <span className="flex items-center gap-1 font-semibold"><Check className="w-3.5 h-3.5" /> Promotion applied</span>
              <span className="font-bold">-0 credits</span>
            </div>

            <div className="border-t border-white/10 my-4 pt-4" />

            <div className="flex items-center justify-between text-base text-white">
              <span className="font-bold">Total Cost</span>
              <span className="font-black text-xl text-purple-400">{costCredits} credits</span>
            </div>
          </div>

          <div className="mt-8 space-y-3 shrink-0">
            <button
              onClick={handleLaunch}
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4.5 rounded-xl font-bold transition-all duration-300 cursor-pointer shadow-md select-none",
                isSubmitting
                  ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                  : "bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Pipeline...
                </>
              ) : (
                <>
                  Launch Short Series 🚀
                </>
              )}
            </button>
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full text-xs text-slate-400 hover:text-white transition-colors py-2 block text-center"
            >
              Go Back and Edit Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
