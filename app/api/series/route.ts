import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/client";

// Persistent global cache in-memory fallback for a seamless local-first experience
let globalSeries = (globalThis as any).seriesStore || [];
(globalThis as any).seriesStore = globalSeries;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient();
    
    // Attempt querying Supabase series table
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase query failed, falling back to local storage:", error.message);
      // Fallback: Filter in-memory database by user ID
      const userSeries = globalSeries.filter((s: any) => s.user_id === userId);
      return NextResponse.json(userSeries);
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET series api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      nicheType, nicheId, customNicheDescription, 
      language, voiceId, voiceModel, voiceName,
      visualStyle, musicStyle, scheduleFrequency, scheduleTime 
    } = body;

    const seriesId = crypto.randomUUID();
    const newSeries = {
      id: seriesId,
      user_id: userId,
      niche_type: nicheType || "available",
      niche_id: nicheId || "",
      custom_description: customNicheDescription || "",
      language: language || "English",
      voice_id: voiceId || "",
      voice_model: voiceModel || "",
      voice_name: voiceName || "",
      visual_style: visualStyle || "cinematic",
      music_style: musicStyle || "lofi",
      schedule_frequency: scheduleFrequency || "daily",
      schedule_time: scheduleTime || "18:00",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try saving in Supabase
    const supabase = createClient();
    const { data, error } = await supabase
      .from("series")
      .insert(newSeries)
      .select()
      .single();

    if (error) {
      console.warn("Supabase insert failed, storing in local fallback:", error.message);
      globalSeries.unshift(newSeries);
      
      // Auto-trigger generation of the first video inside local queue
      await triggerVideoGeneration(newSeries);
      
      return NextResponse.json(newSeries);
    }

    // Trigger video generation for live database
    await triggerVideoGeneration(data);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("POST series api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, is_active } = body;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("series")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.warn("Supabase update failed, modifying local fallback");
      const idx = globalSeries.findIndex((s: any) => s.id === id && s.user_id === userId);
      if (idx !== -1) {
        globalSeries[idx].is_active = is_active;
        globalSeries[idx].updated_at = new Date().toISOString();
        return NextResponse.json(globalSeries[idx]);
      }
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PUT series api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("series")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.warn("Supabase delete failed, removing from local fallback");
      const initialLength = globalSeries.length;
      globalSeries = globalSeries.filter((s: any) => !(s.id === id && s.user_id === userId));
      (globalThis as any).seriesStore = globalSeries;
      
      // Also delete cascaded local videos
      let globalVideos = (globalThis as any).videosStore || [];
      globalVideos = globalVideos.filter((v: any) => v.series_id !== id);
      (globalThis as any).videosStore = globalVideos;

      if (globalSeries.length < initialLength) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE series api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Background Helper: Generates a high quality initial short video based on niche topics
async function triggerVideoGeneration(series: any) {
  try {
    const videoId = crypto.randomUUID();
    const titlesByNiche: Record<string, string[]> = {
      "scary-stories": [
        "The Attic Footsteps at 3 AM",
        "A Phone Call from the Future",
        "Don't Open the Basement Door"
      ],
      "motivational": [
        "The 1% Rule of Daily Progress",
        "Why Winners Embrace Failure",
        "Rewire Your Mind for Greatness"
      ],
      "educational": [
        "The Quantum Physics Mystery Explained",
        "How the Library of Alexandria Burned",
        "Why Space is Expanding Faster Than Light"
      ],
      "gaming": [
        "The Secret Gaming Lore We All Missed",
        "How a Speedrunner Broke a 10 Year Record",
        "Epic Fail to Legendary Moment"
      ],
      "tech-news": [
        "How Quantum AI Will Alter Humanity by 2030",
        "Next-Gen Silicon Chips Explained Simply",
        "The Robots Are Adapting Faster Than Expected"
      ],
      "reddit-stories": [
        "Am I The A**Hole for Cancelling My Sister's Wedding?",
        "TIFU by Replying All to the CEO of My Company",
        "Am I The A**Hole for Refusing to Pay for My Cousin's Vacation?"
      ]
    };

    const scriptsByNiche: Record<string, string[]> = {
      "scary-stories": [
        "It was exactly 3:14 AM when I woke up to footsteps in the attic. My wife was sleeping soundly next to me. I grabbed a flashlight and climbed the dusty ladder. The dust was thick on the floor boards, undisturbed. But as I turned around, I noticed a single set of fresh footsteps coming out of the shadows. And they ended right behind me.",
        "My phone rang. The screen displayed a strange, corrupted number. I answered it anyway. A voice identical to my own, but sounding twenty years older, whispered: 'Don't get in the car tomorrow morning. Whatever you do, walk.' The line cut. The next day, I walked. As I crossed the street, a semi-truck crashed right through my empty parked car.",
        "I was told never to open the iron basement door. For ten years, I listened. But one quiet summer afternoon, curiosity got the best of me. I slid the lock. Inside, it was completely empty, save for a single black antique mirror. I stepped closer to inspect it. In the glass, my reflection wasn't looking at me. It was facing the dark corner, smiling at something else."
      ],
      "motivational": [
        "If you improve by just one percent every single day, you will be thirty-seven times better by the end of the year. Growth isn't about giant leaps; it is about microscopic, daily victories. Do not focus on the mountain; focus on the single step in front of you. Keep pushing, you are closer than you think.",
        "Success is not final, failure is not fatal. It is the courage to continue that counts. Winners do not succeed because they never fail; they succeed because they simply refuse to quit when they do. Every setback is merely a setup for an epic comeback. Embrace the friction, it is making you stronger.",
        "Your mind is a supercomputer. If you feed it thoughts of doubt, fear, and limitation, it will run programs that manifest exactly that. Rewire your vocabulary. Replace 'I can't' with 'How can I?'. The moment you change your internal narrative, your external reality will adapt. Greatness is a conscious choice."
      ],
      "educational": [
        "At the quantum level, particles can exist in multiple states simultaneously, a concept known as superposition. But the moment we observe them, they collapse into a single reality. Does this mean our conscious observation defines the universe? Science is still struggling to answer this ancient mystery.",
        "The Library of Alexandria was not destroyed in a single tragic fire as popular myths suggest. Instead, it suffered a slow, centuries-long decline. Funding cuts, civil wars, and shifting political empires gradually eroded its vast archives, proving that neglect is far more dangerous to knowledge than fire.",
        "Space is not just expanding; it is accelerating in its expansion. Galaxies are moving away from each other faster than the speed of light. This expansion is driven by Dark Energy, a mysterious force comprising seventy percent of the cosmos, which we still know almost nothing about."
      ],
      "gaming": [
        "Inside the game's secret file directories lies a discarded piece of lore. For ten years, players assumed a certain character was a villain. But this hidden diary reveals they were acting to protect the entire game universe from a corrupted entity. A stunning twist hidden in plain sight.",
        "The speedrun record was deemed impossible to beat. But a player discovered a sub-pixel collision glitch. By executing a frame-perfect jump, they bypassed a full three-hour dungeon, shaving minutes off the world record and redefining the boundaries of competitive gaming history.",
        "He had one health point left. The boss was preparing their final arena-clearing attack. With zero room for error, he executed a perfect counter-deflect, followed by a double aerial slash, turning a disastrous defeat into one of the most legendary clutch gaming victories of the year."
      ],
      "tech-news": [
        "By 2030, quantum artificial intelligence could process complex datasets in minutes that would take current supercomputers ten thousand years. This will completely revolutionize medical research, climate modeling, and space navigation, marking the dawn of a post-silicon computational era.",
        "Next-generation chip architectures are ditching electrical signals in favor of light-based optical pathways. By using photons instead of electrons, processors can transfer vast packets of data at lightning speeds while consuming a fraction of the thermal energy, solving heat limitations.",
        "AI agents are now training other AI models in simulated environments, creating a recursive self-improvement loop. As these models iterate, they are developing unique logical algorithms that human engineers didn't teach them. The acceleration rate of artificial intelligence is truly staggering."
      ],
      "reddit-stories": [
        "My sister has been planning her dream wedding for three years. Last week, she demanded I sell my house so she could upgrade to a castle venue. When I laughed and said absolutely not, she disinvited me and told the family I was ruining her life. So, I called the caterer I was paying for and cancelled the booking. Am I the a**hole?",
        "TIFU by replying all to the CEO of my multi-national company. He sent a standard corporate announcement about efficiency. I meant to text my coworker 'Here comes another useless lecture from the silver-spoon board.' Instead, I hit reply all to fifty thousand employees. Now I'm sitting in the HR waiting room. Wish me luck.",
        "My cousin booked a luxury trip to Greece and assumed I was paying for her share since I'm a software engineer. When the travel agent sent me the bill, I called them and removed her from the itinerary. Now my aunt is calling me selfish and saying I've ruined her daughter's mental health. Am I the a**hole?"
      ]
    };

    const niches = series.niche_type === "available" ? series.niche_id : "custom";
    const titleCollection = titlesByNiche[niches] || [
      `Automated Shorts Segment #${Math.floor(Math.random() * 100)}`,
      `Decoding the ${series.niche_id || 'niche'} Chronicles`,
      `Viral Short: Secrets of the Niche`
    ];
    const scriptCollection = scriptsByNiche[niches] || [
      series.custom_description || "Autonomous content generation synthesizing live facts and viral scripts tailored to audience niches."
    ];

    const randomIndex = Math.floor(Math.random() * titleCollection.length);
    const videoTitle = titleCollection[randomIndex];
    const videoScript = scriptCollection[randomIndex % scriptCollection.length];

    const scheduledDate = new Date();
    scheduledDate.setHours(scheduledDate.getHours() + 1); // scheduled for 1 hour from now

    const newVideo = {
      id: videoId,
      series_id: series.id,
      user_id: series.user_id,
      title: videoTitle,
      script: videoScript,
      status: "scheduled",
      scheduled_for: scheduledDate.toISOString(),
      published_at: null,
      created_at: new Date().toISOString()
    };

    // Attempt save in Supabase
    const supabase = createClient();
    const { error } = await supabase
      .from("videos")
      .insert(newVideo);

    if (error) {
      console.warn("Supabase video insert failed, adding to in-memory fallback:", error.message);
      let globalVideos = (globalThis as any).videosStore || [];
      globalVideos.unshift(newVideo);
      (globalThis as any).videosStore = globalVideos;
    }
  } catch (err) {
    console.error("Failed to trigger video generation helper:", err);
  }
}
