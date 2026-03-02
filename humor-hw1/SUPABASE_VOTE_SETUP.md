# Fix "Could not find the 'vote' column" (caption_votes)

1. Open **Supabase Dashboard** → your project → **SQL Editor**.
2. Open `supabase/migrations/20250217000000_add_caption_votes_vote_column.sql` in this repo.
3. Copy the **entire** file contents and paste into the SQL Editor.
4. Click **Run**.
5. Try upvoting again; the schema cache reloads automatically.

Your app expects a `caption_votes` table with at least `caption_id` and `vote` (1 or -1). The migration creates the table or adds the `vote` column if it’s missing.
