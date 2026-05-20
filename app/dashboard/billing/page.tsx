"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  CreditCard, Check, Zap, Sparkles, Award, ShieldAlert,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLANS = [
  {
    id: "free",
    name: "Starter Automation",
    price: "$0",
    period: "forever",
    description: "Ideal for testing autonomous short generation parameters.",
    credits: "10 monthly credits",
    features: [
      "1 automated short video series",
      "Standard SD synthetic rendering",
      "Standard text-to-speech models",
      "Manual downloader access",
    ],
    buttonText: "Current Plan",
    popular: false,
    color: "border-white/5 bg-slate-900/10",
  },
  {
    id: "pro",
    name: "Pro Creator",
    price: "$19",
    period: "month",
    description: "Perfect for active content creators publishing daily across channels.",
    credits: "100 monthly credits",
    features: [
      "Up to 5 autonomous series",
      "High Definition visual engines",
      "Premium TTS voice access (Fonadalab)",
      "Direct auto-publishing API hooks",
      "Priority generation queue",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    color: "border-purple-500/40 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
  {
    id: "studio",
    name: "Production Studio",
    price: "$49",
    period: "month",
    description: "Built for media agencies managing massive social channel footprints.",
    credits: "500 monthly credits",
    features: [
      "Unlimited autonomous short series",
      "Ultra-HD 4K generation engines",
      "Enterprise TTS models (ElevenLabs)",
      "Advanced timed caption styling options",
      "24/7 dedicated support representative",
    ],
    buttonText: "Upgrade to Studio",
    popular: false,
    color: "border-white/5 bg-slate-900/10 hover:border-white/10",
  },
];

export default function BillingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpgrade = (planId: string) => {
    if (planId === "free") return;

    setLoadingId(planId);
    toast.info("Connecting to Stripe Checkout", {
      description: "Preparing your billing portal interface..."
    });

    setTimeout(() => {
      setLoadingId(null);
      toast.success("Upgrade Completed successfully!", {
        description: `Welcome to the ${planId === "pro" ? "Pro Creator" : "Production Studio"} family! Your credits have been updated.`
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Billing & Pricing Plan</h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Top up your short video generation credits or upgrade your automation limits.
        </p>
      </div>

      {/* Credit Summary Card */}
      <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Active Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">10</span>
            <span className="text-sm text-slate-400 font-medium">Credits Available</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            Each video generation consumes exactly 1 credit. Free tier credits auto-renew every month on your subscription date.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleUpgrade("pro")}
            className="bg-white hover:bg-slate-200 text-slate-950 font-bold px-6 py-5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 mr-1.5 fill-current" /> Buy Credit Pack
          </Button>
        </div>
      </div>

      {/* Plans Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 pt-4">
          <Award className="w-5 h-5 text-purple-400" />
          Subscription Tiers
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "p-6 rounded-3xl border flex flex-col justify-between relative group transition-all duration-300",
                plan.color
              )}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-linear-to-r from-purple-500 to-pink-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3 fill-current" /> Popular choice
                </span>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="font-black text-xl text-slate-100">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.period}</span>
                </div>

                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/10 px-3 py-1.5 rounded-lg block text-center w-max">
                  {plan.credits}
                </span>

                <div className="border-t border-white/5 my-4" />

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.id === "free" || loadingId !== null}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer text-center block shadow-sm border",
                    plan.id === "free"
                      ? "bg-slate-900 border-white/5 text-slate-500 cursor-default"
                      : plan.popular
                        ? "bg-purple-600 hover:bg-purple-700 text-white border-transparent shadow-[0_0_15px_rgba(168,85,247,0.2)] active:scale-[0.98]"
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/10 active:scale-[0.98]"
                  )}
                >
                  {loadingId === plan.id ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing Stripe...
                    </span>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing FAQ info */}
      <div className="bg-slate-900/10 border border-white/5 rounded-2xl p-5 flex items-start gap-3.5 max-w-2xl">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-300">Secure Billing Policy</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Subscriptions can be canceled at any time. Remaining generated credits will be preserved inside your vaults for up to 90 days after active billing termination.
          </p>
        </div>
      </div>
    </div>
  );
}
