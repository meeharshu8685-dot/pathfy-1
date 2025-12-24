-- 1. Fix Goals Table schema
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS field TEXT,
ADD COLUMN IF NOT EXISTS quiz_results JSONB,
ADD COLUMN IF NOT EXISTS achievement_plan JSONB,
ADD COLUMN IF NOT EXISTS calibrated_skill_level TEXT;

-- 2. Fix Token Transactions schema for Razorpay tracking
ALTER TABLE public.token_transactions
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'success';

-- 3. Ensure RLS is enabled and policies exist for new structures
-- (Policies were already audited and seem okay in safe_roadmap_setup.sql, but let's ensure goals is covered)

-- 4. Fix any potential mission columns in daily_plans if needed
-- (Audit showed it was mostly okay but let's be safe)
ALTER TABLE public.daily_plans
ADD COLUMN IF NOT EXISTS focus_warning TEXT;

-- 5. Add triggers for updated_at where missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_goals_updated_at') THEN
        CREATE TRIGGER update_goals_updated_at
        BEFORE UPDATE ON public.goals
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
