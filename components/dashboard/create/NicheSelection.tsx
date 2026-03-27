"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Ghost, Lightbulb, Gamepad2, Laptop, MessageSquare, ArrowRight } from "lucide-react";

interface NicheSelectionProps {
  onNext: () => void;
}

const availableNiches = [
  {
    id: "scary-stories",
    title: "Scary Stories",
    description: "Creepy tales and paranormal experiences that keep viewers on edge.",
    icon: Ghost,
  },
  {
    id: "motivational",
    title: "Motivational",
    description: "Inspiring quotes and success stories to boost productivity.",
    icon: Lightbulb,
  },
  {
    id: "educational",
    title: "Educational",
    description: "Fascinating facts, history, and science explained simply.",
    icon: BookOpen,
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Epic moments, lore, and updates from the gaming world.",
    icon: Gamepad2,
  },
  {
    id: "tech-news",
    title: "Tech News",
    description: "Latest gadgets, AI updates, and technology breakthroughs.",
    icon: Laptop,
  },
  {
    id: "reddit-stories",
    title: "Reddit Stories",
    description: "Viral AITA threads and interesting personal anecdotes.",
    icon: MessageSquare,
  },
];

export const NicheSelection = ({ onNext }: NicheSelectionProps) => {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Select Your Niche
        </h2>
        <p className="text-slate-400 mt-2">
          What kind of short videos do you want to generate?
        </p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-900 border border-white/10 p-1 mb-8">
          <TabsTrigger 
            value="available"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 rounded-md"
          >
            Available Niche
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 rounded-md"
          >
            Custom Niche
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="w-full">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableNiches.map((niche) => {
                  const isSelected = selectedNiche === niche.id;
                  return (
                    <div
                      key={niche.id}
                      onClick={() => setSelectedNiche(niche.id)}
                      className={cn(
                        "p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all duration-200",
                        isSelected 
                          ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                          : "bg-slate-800/50 border-white/5 hover:border-white/10 hover:bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        isSelected ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-slate-400"
                      )}>
                        <niche.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={cn(
                          "font-semibold mb-1",
                          isSelected ? "text-purple-300" : "text-slate-200"
                        )}>
                          {niche.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {niche.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <Button 
                onClick={onNext}
                disabled={!selectedNiche}
                className="bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] px-8 py-2 rounded-full font-semibold"
              >
                Continue to Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="py-12">
              <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Have a unique idea?</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Describe your custom niche in detail and our AI will tailor the script generation perfectly to your needs.
              </p>
              
              <div className="max-w-xl mx-auto text-left">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Describe your Niche
                </label>
                <textarea 
                  className="w-full h-32 bg-slate-800 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  placeholder="e.g. A channel dedicated to 1920s jazz history facts and vintage photos..."
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button 
                onClick={onNext}
                className="bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] px-8 py-2 rounded-full font-semibold"
              >
                Continue to Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
