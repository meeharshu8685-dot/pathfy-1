-- Add selected_approach_id column to goals table
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS selected_approach_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.goals.selected_approach_id IS 'ID of the selected preparation approach from Goal Approach Planner';
