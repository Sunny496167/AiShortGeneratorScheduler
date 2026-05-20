"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StepFooter } from "@/components/dashboard/create/StepFooter";
import { Calendar, Clock, Sparkles } from "lucide-react";
import type { CreateSeriesData } from "@/app/dashboard/create/page";

interface ScheduleSelectionProps {
  initialData: CreateSeriesData;
  onNext: (data: Partial<CreateSeriesData>) => void;
  onBack: () => void;
}

const FREQUENCIES = [
  {
    id: "daily",
    name: "Daily Automation",
    description: "Generate and schedule 1 short video every day of the week. Ultimate growth pace.",
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    multiplier: 7,
  },
  {
    id: "mwf",
    name: "3 Times a Week (MWF)",
    description: "Schedule shorts to generate on Monday, Wednesday, and Friday. Perfect balanced growth.",
    activeDays: ["Mon", "Wed", "Fri"],
    multiplier: 3,
  },
  {
    id: "weekly",
    name: "Weekly Digest",
    description: "Schedule exactly 1 high-quality short per week, published every Sunday.",
    activeDays: ["Sun"],
    multiplier: 1,
  },
];

const PRESET_TIMES = [
  { label: "Morning Prime", time: "09:00", desc: "Best for commuters" },
  { label: "Lunch Break", time: "13:00", desc: "Best for midday browsing" },
  { label: "Evening Peak", time: "18:00", desc: "Highest traffic window" },
  { label: "Night Chill", time: "21:00", desc: "Relaxing audience" },
];

export const ScheduleSelection = ({ initialData, onNext, onBack }: ScheduleSelectionProps) => {
  const initialFreq = (initialData as any).scheduleFrequency || "daily";
  const initialTime = (initialData as any).scheduleTime || "18:00";

  const [frequency, setFrequency] = useState<string>(initialFreq);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);

  const activeDays = FREQUENCIES.find((f) => f.id === frequency)?.activeDays || [];

  const handleNext = () => {
    onNext({
      ...initialData,
      scheduleFrequency: frequency,
      scheduleTime: selectedTime,
    } as any);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
          Scheduling & Frequency
        </h2>
        <p className="text-slate-400 mt-2">
          Decide how frequently your channel publishes, and choose the perfect daily upload hours.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Column: Frequency Selection */}
        <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-5 shrink-0">
            <Calendar className="w-4 h-4 text-purple-400" />
            Scheduling Frequency
          </label>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {FREQUENCIES.map((freq) => {
              const isSelected = frequency === freq.id;

              return (
                <div
                  key={freq.id}
                  onClick={() => setFrequency(freq.id)}
                  className={cn(
                    "p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative group flex flex-col gap-3.5",
                    isSelected
                      ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.01]"
                      : "bg-slate-800/40 border-white/5 hover:border-white/12 hover:bg-slate-800/80"
                  )}
                >
                  <div>
                    <h3 className={cn(
                      "font-bold text-base leading-none transition-colors duration-200",
                      isSelected ? "text-purple-300" : "text-slate-200"
                    )}>
                      {freq.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {freq.description}
                    </p>
                  </div>

                  {/* Active Days Grid Badge */}
                  <div className="flex flex-wrap items-center gap-1">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                      const isActive = freq.activeDays.includes(day);
                      return (
                        <span
                          key={day}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-semibold border transition-colors",
                            isActive
                              ? isSelected
                                ? "bg-purple-500 text-white border-purple-400"
                                : "bg-white/15 text-slate-200 border-white/10"
                              : "bg-white/5 text-slate-600 border-transparent"
                          )}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Time Selection */}
        <div className="w-full md:w-80 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col shrink-0">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-5 shrink-0">
            <Clock className="w-4 h-4 text-blue-400" />
            Posting Time Presets
          </label>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {PRESET_TIMES.map((preset) => {
              const isSelected = selectedTime === preset.time;

              return (
                <div
                  key={preset.time}
                  onClick={() => setSelectedTime(preset.time)}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200",
                    isSelected
                      ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "bg-slate-800/40 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="space-y-0.5">
                    <h4 className={cn(
                      "font-bold text-sm",
                      isSelected ? "text-blue-300" : "text-slate-200"
                    )}>
                      {preset.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-none">
                      {preset.desc}
                    </p>
                  </div>
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded font-mono font-bold transition-all",
                    isSelected ? "bg-blue-500 text-white" : "bg-slate-900 text-slate-400 border border-white/5"
                  )}>
                    {preset.time}
                  </span>
                </div>
              );
            })}

            {/* Custom Time Selector */}
            <div className="p-4 bg-slate-900/80 border border-white/5 rounded-xl space-y-3 mt-4">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 leading-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Custom Posting Hour
              </span>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-center font-mono font-bold text-lg select-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 shrink-0">
        <StepFooter
          onNext={handleNext}
          onBack={onBack}
          isNextDisabled={!frequency || !selectedTime}
          showBack
        />
      </div>
    </div>
  );
};
