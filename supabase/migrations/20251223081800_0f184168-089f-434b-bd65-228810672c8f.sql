-- Add new columns to goals table for Achievement Planner
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS field text DEFAULT 'other',
ADD COLUMN IF NOT EXISTS quiz_results jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS achievement_plan jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS calibrated_skill_level text DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.goals.field IS 'Career field: tech, exams, sports, business, arts, govt, other';
COMMENT ON COLUMN public.goals.quiz_results IS 'Adaptive quiz responses and calibrated level data';
COMMENT ON COLUMN public.goals.achievement_plan IS 'Full structured output from AI analysis';
COMMENT ON COLUMN public.goals.calibrated_skill_level IS 'Quiz-adjusted skill level after safety downgrade';