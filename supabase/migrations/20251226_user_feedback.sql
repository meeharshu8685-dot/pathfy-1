-- Create user_feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feature TEXT NOT NULL,
    flag TEXT NOT NULL CHECK (flag IN ('good', 'very_good', 'excellent', 'issue')),
    feedback_text TEXT,
    eligible_for_testimonial BOOLEAN NOT NULL,
    show_in_testimonial BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can insert their own feedback
CREATE POLICY "Anyone can insert feedback" ON public.user_feedback
    FOR INSERT WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback" ON public.user_feedback
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role (or admins) can update/delete (not created here for simplicity)
