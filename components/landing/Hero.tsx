"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Hero() {
  const { isLoaded, userId } = useAuth();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Reelio AI 2.0 is now live</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Automate your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
              short-form empire
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate, schedule, and dominate YouTube Shorts, Instagram Reels, and TikToks with the power of fully autonomous AI.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoaded ? null : !userId ? (
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                  Start Creating for Free <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 50% to-transparent z-10" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden aspect-[16/9] relative">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mt-8 rounded-lg border border-white/5 bg-slate-950/80 h-full p-6 flex gap-6">
              {/* Mock Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6 opacity-60">
                <div className="h-8 rounded bg-white/5 w-full" />
                <div className="h-8 rounded bg-white/5 w-3/4" />
                <div className="h-8 rounded bg-white/5 w-5/6" />
              </div>
              {/* Mock Main Content */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 w-full" />
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3">
                      <div className="aspect-[9/16] rounded-lg bg-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white/20" />
                        </div>
                      </div>
                      <div className="h-4 rounded bg-white/10 w-3/4" />
                      <div className="h-3 rounded bg-white/5 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
