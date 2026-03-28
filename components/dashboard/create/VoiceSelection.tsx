"use client";

import { useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { StepFooter } from "@/components/dashboard/create/StepFooter";
import { Play, Pause, User, Mic2, Globe2 } from "lucide-react";
import type { CreateSeriesData } from "@/app/dashboard/create/page";

interface VoiceSelectionProps {
  initialData: CreateSeriesData;
  onNext: (data: Partial<CreateSeriesData>) => void;
  onBack: () => void;
}

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "Tamil", "Telugu", 
  "Marathi", "Bengali", "Gujarati", "Kannada", "Malayalam", "Punjabi"
];

// Mock Data based on user's JSON structure
const VOICES_DB = [
  { id: "v1", language: "English", model: "deepgram", modelName: "aura-en", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v2", language: "English", model: "deepgram", modelName: "aura-asteria", gender: "female", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v3", language: "English", model: "fonadalab", modelName: "raaga", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v4", language: "English", model: "fonadalab", modelName: "swara", gender: "female", preview: "/preview/fonadalab-raaga.mp3" },
  
  { id: "v5", language: "Hindi", model: "fonadalab", modelName: "raaga-hi", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v6", language: "Hindi", model: "deepgram", modelName: "aura-hi", gender: "female", preview: "/preview/fonadalab-raaga.mp3" },
  
  { id: "v7", language: "Spanish", model: "deepgram", modelName: "aura-es", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v8", language: "Spanish", model: "fonadalab", modelName: "sofia", gender: "female", preview: "/preview/fonadalab-raaga.mp3" },
  
  { id: "v9", language: "French", model: "deepgram", modelName: "aura-fr", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  
  { id: "v10", language: "Tamil", model: "fonadalab", modelName: "karthik", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v11", language: "Telugu", model: "fonadalab", modelName: "ram", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v12", language: "Marathi", model: "fonadalab", modelName: "arjun", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v13", language: "Bengali", model: "deepgram", modelName: "aura-bn", gender: "female", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v14", language: "Gujarati", model: "fonadalab", modelName: "dev", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v15", language: "Kannada", model: "fonadalab", modelName: "darshan", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v16", language: "Malayalam", model: "deepgram", modelName: "aura-ml", gender: "female", preview: "/preview/fonadalab-raaga.mp3" },
  { id: "v17", language: "Punjabi", model: "fonadalab", modelName: "singh", gender: "male", preview: "/preview/fonadalab-raaga.mp3" },
];

export const VoiceSelection = ({ initialData, onNext, onBack }: VoiceSelectionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialData.language || "English");
  const [selectedVoiceId, setSelectedVoiceId] = useState(initialData.voiceId || "");
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const availableVoices = useMemo(() => {
    return VOICES_DB.filter(v => v.language === selectedLanguage);
  }, [selectedLanguage]);

  // Handle Audio Preview
  const togglePlay = (e: React.MouseEvent, voiceId: string, previewUrl: string) => {
    e.stopPropagation(); // prevent card click
    
    // Simplistic mock player logic
    if (playingId === voiceId) {
      setPlayingId(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setPlayingId(voiceId);
      // In a real app we'd trigger audio here dynamically
      // e.g. new Audio(previewUrl).play()
      // For this step, we just visually indicate play.
    }
  };

  const handleNext = () => {
    const chosenVoice = VOICES_DB.find(v => v.id === selectedVoiceId);
    if (chosenVoice) {
      onNext({
        language: selectedLanguage,
        voiceId: chosenVoice.id,
        voiceModel: chosenVoice.model,
        voiceName: chosenVoice.modelName
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
          Language & Voice
        </h2>
        <p className="text-slate-400 mt-2">
          Select the spoken language and the AI voice model for your series.
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0 space-y-6">
        {/* Language Selection */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 shrink-0">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            <Globe2 className="w-4 h-4 text-purple-400" />
            Select Content Language
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setSelectedVoiceId(""); // reset voice on lang change
              }}
              className="w-full appearance-none bg-slate-800 border border-white/10 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer text-base"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {/* Custom downward arrow */}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Voice Selection List */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex-1 flex flex-col min-h-0">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4 shrink-0">
            <Mic2 className="w-4 h-4 text-blue-400" />
            Available Voices ({availableVoices.length})
          </label>
          
          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableVoices.length > 0 ? availableVoices.map((voice) => {
                const isSelected = selectedVoiceId === voice.id;
                const isPlaying = playingId === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoiceId(voice.id)}
                    className={cn(
                      "p-5 rounded-xl border flex flex-col gap-4 cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] scale-[1.02]" 
                        : "bg-slate-800/50 border-white/5 hover:border-white/10 hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          isSelected ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-slate-400"
                        )}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={cn(
                            "font-bold text-lg leading-tight",
                            isSelected ? "text-purple-300" : "text-slate-200"
                          )}>
                            {voice.modelName}
                          </h3>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">
                            {voice.model}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => togglePlay(e, voice.id, voice.preview)}
                        className={cn(
                          "p-2.5 rounded-full transition-colors shrink-0",
                          isPlaying 
                            ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            : "bg-white/5 text-slate-300 hover:bg-white/15"
                        )}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex gap-2">
                       <span className="px-2.5 py-1 text-xs font-medium bg-white/5 text-slate-300 rounded-md capitalize border border-white/5">
                          {voice.gender} voice
                       </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-8 text-center text-slate-500">
                  No voices available for the selected language.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto shrink-0">
        <StepFooter 
          onNext={handleNext} 
          onBack={onBack}
          isNextDisabled={!selectedVoiceId} 
          showBack
        />
      </div>
    </div>
  );
};
