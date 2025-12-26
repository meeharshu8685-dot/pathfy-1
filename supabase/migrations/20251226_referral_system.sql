-- Add share_count to profiles
ALTER TABLE IF EXISTS profiles 
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- Create shares_log table
CREATE TABLE IF NOT EXISTS shares_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  rewarded_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE shares_log ENABLE ROW LEVEL SECURITY;

-- Policies for shares_log
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'shares_log' AND policyname = 'Users can view their own share logs'
  ) THEN
    CREATE POLICY "Users can view their own share logs" ON shares_log
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Drop trigger if exists to avoid errors on reapplying
DROP TRIGGER IF EXISTS on_share_rewarded ON shares_log;
DROP FUNCTION IF EXISTS handle_share_token_reward();

-- Function to handle token reward logic (can also be done in edge function, but DB trigger is safer)
-- However, for the extra 10 tokens logic, edge function is more flexible for future changes.
-- Let's keep it simple and handle the logic in the Edge Function as planned.
