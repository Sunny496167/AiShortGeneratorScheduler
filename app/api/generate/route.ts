import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/client";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Creative short video catalog resources to generate highly premium matched scripts
    const sampleNiches = [
      {
        niche: "scary-stories",
        titles: [
          "The Locked Mirror in the Cabin",
          "Voices in the Static Radio",
          "The Shadow That Walks at Noon"
        ],
        scripts: [
          "I rented an isolated cabin for a writing retreat. In the hallway stood a locked iron cabinet. At midnight, I heard scratchings from inside. I peered through the keyhole and saw a human eye looking back, blinking slowly. Then a voice rasped: 'Thank you for sliding the latch.' I didn't slide the latch.",
          "I was tuning an old analog radio when I intercepted a low static broadcast. It was reading a list of names, followed by times. I laughed, assuming it was a horror podcast. That was until it read my own name, followed by: 'Expiring in five... four... three...'. The power in my house instantly cut.",
          "Everyone is afraid of shadows in the dark. But my shadow only appears in the bright, burning midday sun. And while I stand completely still, my shadow slowly takes a step forward, raising a hand to point toward the local cemetery. I think it is telling me my time is drawing near."
        ]
      },
      {
        niche: "motivational",
        titles: [
          "Ditch the Comfort Zone Now",
          "The Compound Interest of Habits",
          "Your Only Real Opponent"
        ],
        scripts: [
          "Everything you want is on the other side of fear. Your comfort zone is a beautiful place, but absolutely nothing grows there. If you want results you've never had, you must do things you've never done. Embrace the discomfort. That is the exact moment growth happens.",
          "Habits are the compound interest of self-improvement. A tiny one percent improvement daily doesn't feel like much in the moment. But over a year, that compound traction makes you thirty-seven times better. Stop looking for hacks. Trust the consistency of daily compound interest.",
          "Stop comparing your chapter one to someone else's chapter twenty. The only person you should strive to be better than is the person you were yesterday. The noise of the crowd doesn't matter. The doubt of critics doesn't matter. Your only real opponent is staring back at you in the mirror."
        ]
      },
      {
        niche: "educational",
        titles: [
          "How Deep is the Ocean?",
          "The Mystery of the Voynich Manuscript",
          "Why Do We Dream?"
        ],
        scripts: [
          "The deepest part of the ocean is the Mariana Trench, plunging nearly seven miles down. If you dropped Mount Everest into it, the peak would still be covered by thousands of feet of dark water. Under crushing pressures and freezing cold, weird bioluminescent creatures thrive, completely alien to us.",
          "The Voynich Manuscript is a 15th-century book written in an entirely unknown script and illustrated with bizarre plants that don't exist on Earth. Despite decades of analysis by world-class codebreakers and computer algorithms, not a single word has ever been deciphered. A historical enigma.",
          "Why do we dream? While scientists aren't 100% certain, the leading neurological theory is that dreaming is the brain's way of sorting through memories, consolidating knowledge, and running threat simulations. In essence, dreaming is your subconscious running nightly defragmentation."
        ]
      }
    ];

    const randomNiche = sampleNiches[Math.floor(Math.random() * sampleNiches.length)];
    const randomIndex = Math.floor(Math.random() * randomNiche.titles.length);
    const videoTitle = randomNiche.titles[randomIndex];
    const videoScript = randomNiche.scripts[randomIndex];

    const videoId = crypto.randomUUID();
    const scheduledDate = new Date();
    scheduledDate.setHours(scheduledDate.getHours() + 2); // Scheduled for 2 hours from now

    const newVideo = {
      id: videoId,
      series_id: null, // manual on-demand video
      user_id: userId,
      title: videoTitle,
      script: videoScript,
      status: "scheduled", // Starts directly as scheduled/completed simulation
      scheduled_for: scheduledDate.toISOString(),
      published_at: null,
      created_at: new Date().toISOString()
    };

    // Save in Supabase
    const supabase = createClient();
    const { data, error } = await supabase
      .from("videos")
      .insert(newVideo)
      .select()
      .single();

    if (error) {
      console.warn("Supabase video insert failed, adding to in-memory fallback:", error.message);
      const globalVideos = (globalThis as any).videosStore || [];
      globalVideos.unshift(newVideo);
      (globalThis as any).videosStore = globalVideos;
      return NextResponse.json(newVideo);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("POST generate api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
