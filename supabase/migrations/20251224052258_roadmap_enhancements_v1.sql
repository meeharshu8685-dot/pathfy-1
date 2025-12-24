-- Extended roadmap schema for full Mentor Roadmap features
ALTER TABLE public.roadmaps 
ADD COLUMN IF NOT EXISTS what_to_ignore JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS final_reality_check TEXT,
ADD COLUMN IF NOT EXISTS closing_motivation TEXT;

-- Extended roadmap steps for phase-specific details
ALTER TABLE public.roadmap_steps
ADD COLUMN IF NOT EXISTS phase_number INTEGER,
ADD COLUMN IF NOT EXISTS what_to_learn JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS what_to_do JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS outcome TEXT;

-- Update RLS for roadmaps (already enabled, just ensure update is allowed)
CREATE POLICY "Users can update their own roadmaps"
ON public.roadmaps FOR UPDATE
USING (auth.uid() = user_id);

-- Update RLS for roadmap steps
CREATE POLICY "Users can update their own roadmap steps"
ON public.roadmap_steps FOR UPDATE
USING (auth.uid() = user_id);
