-- Add new profile columns for user control features
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS stream TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
ADD COLUMN IF NOT EXISTS available_hours_per_week INTEGER,
ADD COLUMN IF NOT EXISTS primary_commitment TEXT,
ADD COLUMN IF NOT EXISTS preferred_study_time TEXT,
ADD COLUMN IF NOT EXISTS reassessment_reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reassessment_reminder_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS last_reassessment_date TIMESTAMPTZ;