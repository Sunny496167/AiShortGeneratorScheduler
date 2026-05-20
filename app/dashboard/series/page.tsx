"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Folder, Plus, Trash2, Globe, PlayCircle, 
  Settings, Music, Zap, Eye, Loader2,
  ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Series {
  id: string;
  niche_type: "available" | "custom";
  niche_id: string;
  custom_description: string;
  language: string;
  voice_name: string;
  voice_model: string;
  visual_style: string;
  music_style: string;
  schedule_frequency: string;
  schedule_time: string;
  is_active: boolean;
}

export default function SeriesListPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSeries = async () => {
    try {
      const response = await fetch("/api/series");
      if (response.ok) {
        const data = await response.json();
        setSeriesList(data);
      }
    } catch (err) {
      console.error("Failed to load series:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    
    // Optimistic UI state update
    setSeriesList(prev => prev.map(s => s.id === id ? { ...s, is_active: updatedStatus } : s));

    try {
      const response = await fetch("/api/series", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: updatedStatus }),
      });

      if (!response.ok) throw new Error();
      
      toast.success(updatedStatus ? "Automation Activated" : "Automation Paused", {
        description: `Your short video schedule is now ${updatedStatus ? 'generating daily' : 'halted'}.`
      });
    } catch {
      // Revert state on error
      setSeriesList(prev => prev.map(s => s.id === id ? { ...s, is_active: currentStatus } : s));
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    const previousList = [...seriesList];
    setSeriesList(prev => prev.filter(s => s.id !== id));

    try {
      const response = await fetch(`/api/series?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Series Schedule Deleted");
    } catch {
      setSeriesList(previousList);
      toast.error("Failed to delete series schedule");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="text-sm font-medium">Loading scheduled series...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Your Short Series</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Configure, pause, or terminate your scheduled automation pipelines.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="bg-white text-slate-950 font-bold hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] py-5 px-6 rounded-xl transition-all cursor-pointer">
            <Plus className="w-5 h-5 mr-1.5 stroke-[3px]" />
            Create new series
          </Button>
        </Link>
      </div>

      {seriesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesList.map((series) => {
            const nicheTitle = series.niche_type === "available"
              ? series.niche_id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
              : "Custom Niche Channel";

            return (
              <div
                key={series.id}
                className={cn(
                  "p-6 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between h-[280px]",
                  series.is_active
                    ? "bg-slate-900/30 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                    : "bg-slate-900/10 border-white/5 opacity-75 hover:opacity-100"
                )}
              >
                {/* Upper row */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center border",
                        series.is_active
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          : "bg-slate-800 border-white/5 text-slate-500"
                      )}>
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-100 leading-none">{nicheTitle}</h3>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-2 block">
                          Niche Campaign
                        </span>
                      </div>
                    </div>

                    {/* Active/Pause Switch */}
                    <button
                      onClick={() => handleToggleActive(series.id, series.is_active)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {series.is_active ? (
                        <ToggleRight className="w-9 h-9 text-purple-400" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-600" />
                      )}
                    </button>
                  </div>

                  {/* Summary Parameter Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-6">
                    <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-slate-300 font-medium border border-white/5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      {series.language} ({series.voice_name})
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-slate-300 font-medium border border-white/5 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      {series.visual_style} Visuals
                    </span>
                    {series.music_style !== "none" && (
                      <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-slate-300 font-medium border border-white/5 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-teal-400" />
                        {series.music_style} Sound
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Controls row */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Zap className={cn("w-4 h-4", series.is_active ? "text-amber-500 fill-amber-500/10" : "text-slate-600")} />
                    <span className="capitalize">{series.schedule_frequency}</span> at <span className="font-mono">{series.schedule_time}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(series.id)}
                      className="p-2.5 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white hover:border-transparent transition-all cursor-pointer"
                      title="Delete Scheduled Series"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 bg-slate-900/10 border border-white/5 rounded-2xl text-center flex flex-col items-center justify-center gap-4 max-w-xl mx-auto mt-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <Folder className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-300">No scheduled series yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Launch your first automated short generator pipeline in minutes and watch your channels publish on autopilot.
            </p>
          </div>
          <Link href="/dashboard/create" className="pt-2">
            <Button className="bg-white text-slate-950 font-bold hover:bg-slate-200">
              <Plus className="w-4 h-4 mr-1 stroke-[3px]" /> Create first series
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
