import { Wand2, CalendarClock, Mail, CheckCircle2 } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 bg-slate-900/50 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to go viral</h2>
          <p className="text-slate-400 text-lg">Reelio combines cutting-edge AI generation with powerful scheduling tools, so you can focus on strategy while we handle the execution.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-purple-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Video Generation</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Turn text, scripts, or simple ideas into engaging short-form videos with AI-generated visuals, captions, and viral hooks.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Auto-captions</li>
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> B-roll fetching</li>
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Voiceover synthesis</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CalendarClock className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cross-Platform Scheduling</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Plan your content calendar weeks in advance. Reelio automatically posts to YouTube, Instagram, and TikTok at optimal times.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Multi-account support</li>
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Best-time-to-post AI</li>
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Visual calendar</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-fuchsia-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7 text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Audience & Email Sync</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Don't just rely on algorithms. Reelio automatically schedules and sends out your latest videos to your email subscribers.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-fuchsia-500" /> Newsletter integration</li>
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-fuchsia-500" /> Automated digests</li>
              <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-fuchsia-500" /> Analytics tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
