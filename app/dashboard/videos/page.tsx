"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  PlaySquare, Loader2, Search, SlidersHorizontal, 
  Clock, Play, RefreshCw, AlertCircle, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayerModal } from "@/components/dashboard/VideoPlayerModal";
import { toast } from "sonner";

interface Video {
  id: string;
  title: string;
  script: string;
  status: string;
  scheduled_for: string;
  series_id: string;
}

export default function VideosListPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "generating" | "scheduled" | "published">("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isGeneratingManual, setIsGeneratingManual] = useState(false);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...videos];
    
    if (searchQuery.trim().length > 0) {
      result = result.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.script.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      result = result.filter(v => v.status === activeTab);
    }

    setFilteredVideos(result);
  }, [videos, searchQuery, activeTab]);

  const handleManualGeneration = async () => {
    setIsGeneratingManual(true);
    toast.info("Synthesizing manual video short", {
      description: "Asking AI to outline scripts, render scene layers, and sync audio overlays..."
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Synthesis failed");

      const newVideo = await response.json();
      setVideos(prev => [newVideo, ...prev]);
      toast.success("Short Synthesized Successfully", {
        description: "Your video short has been scheduled and added to the queue."
      });
    } catch {
      toast.error("Generation failed");
    } finally {
      setIsGeneratingManual(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="text-sm font-medium">Opening shorts vault...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Video Shorts Gallery</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Review, download, and publish your AI-generated vertical video shorts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleManualGeneration}
            disabled={isGeneratingManual}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold border border-purple-500/20 py-5 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.2)] disabled:bg-slate-800 disabled:text-slate-500 disabled:border-white/5"
          >
            {isGeneratingManual ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Synthesize Quick Short
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Dashboard */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-white/5 rounded-2xl p-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search script content or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center flex-wrap gap-1">
          {(["all", "generating", "scheduled", "published"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-xs px-4 py-2 rounded-lg font-bold border capitalize transition-all cursor-pointer",
                activeTab === tab
                  ? "bg-white text-slate-950 border-transparent shadow-md"
                  : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
              )}
            >
              {tab === "all" ? "All Shorts" : tab === "generating" ? "Generating ⚡" : tab === "scheduled" ? "Scheduled 📅" : "Published ✅"}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] cursor-pointer transition-all duration-300 flex flex-col justify-between h-[240px]"
            >
              {/* Card Header details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-400 flex items-center justify-center text-slate-400 shrink-0 transition-colors">
                    <PlaySquare className="w-5 h-5" />
                  </div>
                  
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full uppercase border shrink-0",
                    video.status === "published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
                    video.status === "scheduled" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
                    "bg-purple-500/15 text-purple-400 border-purple-500/20 animate-pulse"
                  )}>
                    {video.status === "generating" ? "Generating ⚡" : video.status === "scheduled" ? "Scheduled 📅" : "Published ✅"}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 group-hover:text-purple-300 mt-4 line-clamp-2 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic font-serif leading-relaxed">
                  &ldquo;{video.script}&rdquo;
                </p>
              </div>

              {/* Card footer details */}
              <div className="p-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(video.scheduled_for).toLocaleDateString()} at {new Date(video.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-all">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 bg-slate-900/10 border border-white/5 rounded-2xl text-center flex flex-col items-center justify-center gap-4 max-w-xl mx-auto mt-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <PlaySquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-300">No shorts in vault</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Synthesize a manual quick short now or create an automated short video series to populate your videos directory.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleManualGeneration}
              disabled={isGeneratingManual}
              className="bg-white text-slate-950 font-bold hover:bg-slate-200"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Synthesize Quick Short
            </Button>
            <Link href="/dashboard/create">
              <Button className="bg-transparent hover:bg-white/5 text-slate-300 font-bold border border-white/10">
                <Plus className="w-4 h-4 mr-1" /> Setup Schedule
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Video Shorts previewer modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
