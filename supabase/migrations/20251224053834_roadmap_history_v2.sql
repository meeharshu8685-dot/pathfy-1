-- Add favorite support to roadmaps
ALTER TABLE public.roadmaps 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Add index for faster filtering by favorite status
CREATE INDEX IF NOT EXISTS idx_roadmaps_is_favorite ON public.roadmaps(is_favorite);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id_created_at ON public.roadmaps(user_id, created_at DESC);
