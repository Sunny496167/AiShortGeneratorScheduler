import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-purple-900/40 to-slate-950 border border-purple-500/20 p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 relative z-10">Ready to scale your content?</h2>
        <p className="text-xl text-purple-200/70 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of creators who are automating their social presence and gaining millions of views with Reelio.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/10 flex items-center justify-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
        </div>
        <p className="mt-6 text-sm text-purple-300/50 relative z-10">No credit card required • Free tier forever</p>
      </div>
    </section>
  );
}
