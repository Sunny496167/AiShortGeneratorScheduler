"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Settings, Key, Link as LinkIcon, Radio, Save, 
  Youtube, Video, Instagram, HelpCircle, Loader2 
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [publishingDelay, setPublishingDelay] = useState("30");
  const [watermarkText, setWatermarkText] = useState("reelio_shorts");
  const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [isInstaConnected, setIsInstaConnected] = useState(false);

  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);

  const handleConnect = (platform: string) => {
    setLoadingChannel(platform);
    toast.info(`Connecting to ${platform} Auth Server`, {
      description: "Establishing secure Oauth 2.0 pipeline session..."
    });

    setTimeout(() => {
      setLoadingChannel(null);
      if (platform === "YouTube") setIsYoutubeConnected(true);
      if (platform === "TikTok") setIsTiktokConnected(true);
      if (platform === "Instagram") setIsInstaConnected(true);
      
      toast.success(`${platform} Account Linked Successfully!`, {
        description: "Reelio is now authenticated to upload and schedule short clips directly."
      });
    }, 2000);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings Saved", {
        description: "Your default scheduling preferences have been updated."
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Advanced Settings</h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Configuredirect publishing credentials and default channel video properties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Form Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Config */}
          <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-white/5 pb-3">
              <Settings className="w-4.5 h-4.5 text-purple-400" />
              General Video Properties
            </h3>

            {/* Input 1: Watermark */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                Default Caption Watermark
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" title="Optional caption overlay watermark printed on bottom of videos" />
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-mono"
              />
            </div>

            {/* Input 2: Delayed queue */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                Automated Buffer Delay (Minutes)
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" title="Buffer time to inspect generated scripts beforedirect publishing triggers" />
              </label>
              <select
                value={publishingDelay}
                onChange={(e) => setPublishingDelay(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
              >
                <option value="15">15 Minutes (Fast Publish)</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">1 Hour (Thorough Inspection)</option>
                <option value="120">2 Hours (Max Delay)</option>
              </select>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className={cn(
                "bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none",
                isSaving && "opacity-75 cursor-not-allowed"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Preferences
                </>
              )}
            </button>
          </div>

          {/* API keys segment */}
          <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-white/5 pb-3">
              <Key className="w-4.5 h-4.5 text-blue-400" />
              Developer API Keys
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Link custom developer keys to bypass default daily credits restrictions and trigger direct live renderings via high-scale endpoints.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">ElevenLabs API Secret</label>
                <input
                  type="password"
                  placeholder="sk_elevenlabs_••••••••••••••••"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Deepgram API Secret</label>
                <input
                  type="password"
                  placeholder="dg_aura_••••••••••••••••"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Social Channels */}
        <div className="space-y-6">
          <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-md flex flex-col justify-between h-full">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-white/5 pb-3">
                <LinkIcon className="w-4.5 h-4.5 text-emerald-400" />
                Linked Socials
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-3">
                Link channel credentials to publish compiled mp4 shorts immediately upon generation.
              </p>

              <div className="space-y-3.5 pt-5">
                {/* YouTube */}
                <div className="flex items-center justify-between gap-3 p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                    <Youtube className="w-4.5 h-4.5 text-red-500 fill-red-500/10" />
                    YouTube Shorts
                  </div>
                  <button
                    onClick={() => handleConnect("YouTube")}
                    disabled={loadingChannel !== null}
                    className={cn(
                      "text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer",
                      isYoutubeConnected 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-white/5 text-slate-300 border-white/5 hover:bg-white/10"
                    )}
                  >
                    {isYoutubeConnected ? "Linked ✅" : "Connect"}
                  </button>
                </div>

                {/* TikTok */}
                <div className="flex items-center justify-between gap-3 p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                    <Video className="w-4.5 h-4.5 text-white" />
                    TikTok Shorts
                  </div>
                  <button
                    onClick={() => handleConnect("TikTok")}
                    disabled={loadingChannel !== null}
                    className={cn(
                      "text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer",
                      isTiktokConnected 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-white/5 text-slate-300 border-white/5 hover:bg-white/10"
                    )}
                  >
                    {isTiktokConnected ? "Linked ✅" : "Connect"}
                  </button>
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between gap-3 p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                    <Instagram className="w-4.5 h-4.5 text-pink-500" />
                    Instagram Reels
                  </div>
                  <button
                    onClick={() => handleConnect("Instagram")}
                    disabled={loadingChannel !== null}
                    className={cn(
                      "text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer",
                      isInstaConnected 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-white/5 text-slate-300 border-white/5 hover:bg-white/10"
                    )}
                  >
                    {isInstaConnected ? "Linked ✅" : "Connect"}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
              <Radio className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
              Direct-Publish hooks enabled.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
