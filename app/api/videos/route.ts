import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/client";

// In-memory global fallback persistent cache
let globalVideos = (globalThis as any).videosStore || [];
(globalThis as any).videosStore = globalVideos;

// Prepopulate fallback cache with initial beautiful simulated shorts if empty
if (globalVideos.length === 0) {
  const initialDummyVideos = [
    {
      id: "vid-1",
      series_id: "dummy-series-id",
      user_id: "user-dummy",
      title: "Why Space is Expanding Faster Than Light",
      script: "Space is not just expanding; it is accelerating in its expansion. Galaxies are moving away from each other faster than the speed of light. This expansion is driven by Dark Energy, a mysterious force comprising seventy percent of the cosmos, which we still know almost nothing about.",
      status: "published",
      scheduled_for: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
      published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: "vid-2",
      series_id: "dummy-series-id",
      user_id: "user-dummy",
      title: "The 1% Rule of Daily Progress",
      script: "If you improve by just one percent every single day, you will be thirty-seven times better by the end of the year. Growth isn't about giant leaps; it is about microscopic, daily victories. Do not focus on the mountain; focus on the single step in front of you. Keep pushing, you are closer than you think.",
      status: "scheduled",
      scheduled_for: new Date(Date.now() + 3600000 * 3).toISOString(), // 3 hours from now
      published_at: null,
      created_at: new Date().toISOString()
    },
    {
      id: "vid-3",
      series_id: "dummy-series-id",
      user_id: "user-dummy",
      title: "A Phone Call from the Future",
      script: "My phone rang. The screen displayed a strange, corrupted number. I answered it anyway. A voice identical to my own, but sounding twenty years older, whispered: 'Don't get in the car tomorrow morning. Whatever you do, walk.' The line cut. The next day, I walked. As I crossed the street, a semi-truck crashed right through my empty parked car.",
      status: "generating",
      scheduled_for: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours from now
      published_at: null,
      created_at: new Date().toISOString()
    }
  ];
  globalVideos.push(...initialDummyVideos);
  (globalThis as any).videosStore = globalVideos;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient();
    
    // Attempt querying Supabase videos table
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase query failed, falling back to local storage:", error.message);
      
      // Filter local store by user id or return all dummies so that newly logged in users immediately see active samples!
      const userVideos = globalVideos.filter((v: any) => v.user_id === userId || v.user_id === "user-dummy");
      return NextResponse.json(userVideos);
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET videos api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
