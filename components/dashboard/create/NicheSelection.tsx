"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Ghost, Lightbulb, Gamepad2, Laptop, MessageSquare, ArrowRight } from "lucide-react";
import { StepFooter } from "@/components/dashboard/create/StepFooter";

export interface CreateSeriesData {
  nicheType: "available" | "custom";
  nicheId: string;
  customNicheDescription: string;
}

interface NicheSelectionProps {
  initialData: CreateSeriesData;
  onNext: (data: Partial<CreateSeriesData>) => void;
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

export const NicheSelection = ({ initialData, onNext }: NicheSelectionProps) => {
  const [activeTab, setActiveTab] = useState<"available" | "custom">(initialData.nicheType || "available");
  const [selectedNiche, setSelectedNiche] = useState<string>(initialData.nicheId || "");
  const [customDescription, setCustomDescription] = useState<string>(initialData.customNicheDescription || "");

  const handleNext = () => {
    onNext({
      nicheType: activeTab,
      nicheId: selectedNiche,
      customNicheDescription: customDescription
    });
  };

  const isNextDisabled = activeTab === "available" ? !selectedNiche : customDescription.length < 10;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
          Select Your Niche
        </h2>
        <p className="text-slate-400 mt-2">
          What kind of short videos do you want to generate?
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "available" | "custom")} className="w-full flex-1 flex flex-col">
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

        <TabsContent value="available" className="w-full flex-1">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableNiches.map((niche) => {
                  const isSelected = selectedNiche === niche.id;
                  return (
                    <div
                      key={niche.id}
                      onClick={() => setSelectedNiche(niche.id)}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center text-center gap-3 cursor-pointer transition-all duration-200",
                        isSelected 
                          ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] scale-[1.02]" 
                          : "bg-slate-800/50 border-white/5 hover:border-white/10 hover:bg-slate-800 hover:scale-[1.02]"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl",
                        isSelected ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-slate-400"
                      )}>
                        <niche.icon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className={cn(
                          "font-semibold text-sm mb-1",
                          isSelected ? "text-purple-300" : "text-slate-200"
                        )}>
                          {niche.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {niche.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="flex-1">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center mb-8">
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
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full h-32 bg-slate-800 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  placeholder="e.g. A channel dedicated to 1920s jazz history facts and vintage photos..."
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-auto">
        <StepFooter 
          onNext={handleNext} 
          isNextDisabled={isNextDisabled} 
        />
      </div>
    </div>
  );
};
