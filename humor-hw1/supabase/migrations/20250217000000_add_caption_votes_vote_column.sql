-- Run this entire script in Supabase Dashboard → SQL Editor
-- Fixes: "Could not find the 'vote' column of 'caption_votes' in the schema cache"
-- Assignment: store votes in caption_votes (caption_id, vote, and optionally who voted).

-- 1) Create table if it doesn't exist (with columns the app expects)
CREATE TABLE IF NOT EXISTS public.caption_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_id uuid NOT NULL,
  vote smallint NOT NULL CHECK (vote IN (1, -1)),
  created_at timestamptz DEFAULT now()
);

-- 2) If table already existed without "vote", add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'caption_votes' AND column_name = 'vote'
  ) THEN
    ALTER TABLE public.caption_votes
      ADD COLUMN vote smallint NOT NULL DEFAULT 1
      CHECK (vote IN (1, -1));
  END IF;
END $$;

-- 3) Reload schema cache so the API sees the columns
NOTIFY pgrst, 'reload schema';
