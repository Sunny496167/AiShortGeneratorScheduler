"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <div className="h-16 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 lg:justify-end">
      {/* Mobile Menu Toggle - Could be connected to a state in the future */}
      <button className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* We can put secondary actions here eventually */}
        <UserButton />
      </div>
    </div>
  );
};
