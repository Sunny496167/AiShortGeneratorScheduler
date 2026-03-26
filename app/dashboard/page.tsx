import { syncUserToSupabase } from "@/lib/supabase/sync";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  // Synchronize the user with the Supabase database
  await syncUserToSupabase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Welcome to your Dashboard
          </h1>
          <UserButton />
        </header>

        <main className="flex-1 bg-slate-900/50 p-6 rounded-2xl border border-white/10 min-h-[500px] flex items-center justify-center">
          <p className="text-slate-400 text-lg">
            Your user profile has been synced with Supabase! 
            <br />
            You can start building the rest of your dashboard here.
          </p>
        </main>
      </div>
    </div>
  );
}
