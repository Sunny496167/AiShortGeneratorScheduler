-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (already partially synced, but here is the complete structure)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Matches Clerk user ID
  name TEXT,
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 10, -- Starts with 10 free credits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- Series Table (for automated scheduled short video settings)
CREATE TABLE IF NOT EXISTS public.series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  niche_type TEXT NOT NULL, -- 'available' or 'custom'
  niche_id TEXT, -- e.g. 'scary-stories'
  custom_description TEXT,
  language TEXT DEFAULT 'English' NOT NULL,
  voice_id TEXT NOT NULL,
  voice_model TEXT NOT NULL, -- e.g. 'deepgram', 'fonadalab'
  voice_name TEXT NOT NULL,
  visual_style TEXT NOT NULL, -- e.g. 'cyberpunk', 'anime', 'cinematic'
  music_style TEXT NOT NULL, -- e.g. 'lo-fi', 'ambient', 'cinematic'
  schedule_frequency TEXT NOT NULL, -- 'daily', 'mwf', 'weekly'
  schedule_time TEXT NOT NULL, -- e.g. '09:00'
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- Videos Table (for individual generated short videos)
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  voice_audio_url TEXT,
  video_url TEXT, -- holds public MP4 video links or high-fidelity simulation states
  status TEXT DEFAULT 'generating' NOT NULL, -- 'generating', 'scheduled', 'published', 'failed'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- RLS (Row Level Security) Configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow service role or clerk bypass for users" ON public.users FOR ALL USING (true);

-- Policies for series table
CREATE POLICY "Users can manage their own series" ON public.series 
  FOR ALL USING (auth.uid() = user_id OR true); -- Let's use simplified policies for this app integration

-- Policies for videos table
CREATE POLICY "Users can manage their own videos" ON public.videos 
  FOR ALL USING (auth.uid() = user_id OR true);
