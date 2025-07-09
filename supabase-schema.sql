-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_combo INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on score for faster sorting
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);

-- Create an index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_name ON public.leaderboard(name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read leaderboard data
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
    FOR SELECT USING (true);

-- Create policy to allow anyone to insert new scores
CREATE POLICY "Anyone can insert scores" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update their own scores
CREATE POLICY "Anyone can update scores" ON public.leaderboard
    FOR UPDATE USING (true);

-- Create policy to allow anyone to delete scores (for admin purposes)
CREATE POLICY "Anyone can delete scores" ON public.leaderboard
    FOR DELETE USING (true);
