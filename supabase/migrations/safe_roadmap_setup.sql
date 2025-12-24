-- 1. Ensure Roadmaps Table Exists
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  total_steps INTEGER NOT NULL DEFAULT 0,
  completed_steps INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  regeneration_count INTEGER NOT NULL DEFAULT 0,
  last_regenerated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Ensure Roadmap Steps Table Exists
CREATE TABLE IF NOT EXISTS public.roadmap_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_hours INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  is_milestone BOOLEAN NOT NULL DEFAULT false,
  status public.task_status NOT NULL DEFAULT 'locked',
  dependencies UUID[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Add New Columns (Safe IF NOT EXISTS)
ALTER TABLE public.roadmaps 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS what_to_ignore JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS final_reality_check TEXT,
ADD COLUMN IF NOT EXISTS closing_motivation TEXT;

ALTER TABLE public.roadmap_steps
ADD COLUMN IF NOT EXISTS phase_number INTEGER,
ADD COLUMN IF NOT EXISTS what_to_learn JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS what_to_do JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS outcome TEXT;

-- 4. Enable RLS (Safe)
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_steps ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies (Drop first to avoid duplication errors)
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can view their own roadmaps" ON public.roadmaps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can insert their own roadmaps" ON public.roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can update their own roadmaps" ON public.roadmaps FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can delete their own roadmaps" ON public.roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Steps policies
DROP POLICY IF EXISTS "Users can view their own roadmap_steps" ON public.roadmap_steps;
CREATE POLICY "Users can view their own roadmap_steps" ON public.roadmap_steps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own roadmap_steps" ON public.roadmap_steps;
CREATE POLICY "Users can insert their own roadmap_steps" ON public.roadmap_steps FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own roadmap_steps" ON public.roadmap_steps;
CREATE POLICY "Users can update their own roadmap_steps" ON public.roadmap_steps FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own roadmap_steps" ON public.roadmap_steps;
CREATE POLICY "Users can delete their own roadmap_steps" ON public.roadmap_steps FOR DELETE USING (auth.uid() = user_id);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_created ON public.roadmaps(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roadmaps_is_favorite ON public.roadmaps(is_favorite);
