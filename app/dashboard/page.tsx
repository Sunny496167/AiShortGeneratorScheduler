"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Plus, PlaySquare, Folder, Zap, 
  Calendar, CheckCircle, Clock, Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeSeries: 0,
    totalVideos: 0,
    remainingCredits: 10,
    scheduledVideos: 0,
  });
  const [upcomingVideos, setUpcomingVideos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch series to get stats
        const seriesRes = await fetch("/api/series");
        const seriesData = await seriesRes.json();
        
        // Fetch videos
        const videosRes = await fetch("/api/videos");
        const videosData = await videosRes.json();

        const activeCount = seriesData.filter((s: any) => s.is_active).length;
        const totalCount = videosData.length;
        const scheduledCount = videosData.filter((v: any) => v.status === "scheduled" || v.status === "generating").length;

        // Fetch mock/real credit balance
        // We'll set a base remaining credit of 10 minus active series cost as a fun dynamic mechanism
        const remaining = Math.max(0, 10 - seriesData.length);

        setStats({
          activeSeries: activeCount,
          totalVideos: totalCount,
          remainingCredits: remaining,
          scheduledVideos: scheduledCount,
        });

        // Get 3 upcoming scheduled or generating videos sorted by date
        const sortedUpcoming = videosData
          .filter((v: any) => v.status === "scheduled" || v.status === "generating")
          .slice(0, 3);
        
        setUpcomingVideos(sortedUpcoming);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="text-sm font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-400">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Monitor and manage your autonomous short video pipelines.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="bg-white text-slate-950 font-bold hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] py-5 px-6 rounded-xl transition-all cursor-pointer">
            <Plus className="w-5 h-5 mr-1.5 stroke-[3px]" />
            Create new series
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="bg-slate-900/30 border-white/5 backdrop-blur-md rounded-2xl p-5 hover:border-white/10 transition-all">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-purple-400 uppercase tracking-widest">Active Series</CardTitle>
            <Folder className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-3xl font-black text-white">{stats.activeSeries}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Autonomous schedules</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-slate-900/30 border-white/5 backdrop-blur-md rounded-2xl p-5 hover:border-white/10 transition-all">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-blue-400 uppercase tracking-widest">Shorts Generated</CardTitle>
            <PlaySquare className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-3xl font-black text-white">{stats.totalVideos}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">High fidelity short videos</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-slate-900/30 border-white/5 backdrop-blur-md rounded-2xl p-5 hover:border-white/10 transition-all">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-amber-500 uppercase tracking-widest">Remaining Credits</CardTitle>
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-3xl font-black text-white">{stats.remainingCredits}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Auto-renew active</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="bg-slate-900/30 border-white/5 backdrop-blur-md rounded-2xl p-5 hover:border-white/10 transition-all">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Scheduled Queue</CardTitle>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-3xl font-black text-white">{stats.scheduledVideos}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Pending publication</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Upcoming videos */}
        <Card className="lg:col-span-2 bg-slate-900/20 border-white/5 rounded-2xl p-6">
          <CardHeader className="p-0 pb-5 border-b border-white/5">
            <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Upcoming Generation Queue
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Your scheduled shorts currently synthesizing in the pipeline.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 pt-5">
            {upcomingVideos.length > 0 ? (
              <div className="space-y-4">
                {upcomingVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className="p-4 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between gap-4 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                        <PlaySquare className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{video.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Scheduled for {new Date(video.scheduled_for).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <span className={cn(
                      "text-[10px] px-2.5 py-1 rounded-full font-bold border shrink-0",
                      video.status === "generating"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {video.status === "generating" ? "Generating ⚡" : "Scheduled 📅"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-8 h-8 text-slate-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-400">No scheduled generation queue</p>
                  <p className="text-xs text-slate-500 max-w-xs">Create a scheduled series to begin automated short content pipelines.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: Quick tips/Automated publishing summary */}
        <Card className="bg-slate-900/20 border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Autonomous Mode: ON
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reelio is actively checking your scheduling hooks. For every active series:
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span>AI synthesizes viral short scripts based on niche.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span>Audio generation renders human-like deep narrations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span>Custom visual style art generates matched scene frames.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span>Timed styled subtitles overlay automatically.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 border-t border-white/5 pt-4">
            <Link href="/dashboard/videos">
              <Button className="w-full bg-white/5 text-slate-300 font-semibold hover:bg-white/10 hover:text-white border border-white/5 rounded-xl py-5 transition-all text-xs cursor-pointer">
                View Video Gallery
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
