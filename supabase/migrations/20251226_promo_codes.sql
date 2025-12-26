-- Promo Codes Table
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    tokens_awarded INTEGER NOT NULL DEFAULT 50,
    max_uses INTEGER NOT NULL DEFAULT 20,
    current_uses INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- Promo Code Redemptions Table (to track who used what)
CREATE TABLE IF NOT EXISTS public.promo_code_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(promo_code_id, user_id)  -- Each user can only use each code once
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Policies for promo_codes
CREATE POLICY "Anyone can read active promo codes" ON public.promo_codes
    FOR SELECT USING (is_active = true);

-- Policies for promo_code_redemptions
CREATE POLICY "Users can read their own redemptions" ON public.promo_code_redemptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own redemptions" ON public.promo_code_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert the 3 promo codes: ABHI, SIMRAN, HARSHU
INSERT INTO public.promo_codes (code, tokens_awarded, max_uses, is_active)
VALUES 
    ('ABHI', 50, 20, true),
    ('SIMRAN', 50, 20, true),
    ('HARSHU', 50, 20, true)
ON CONFLICT (code) DO NOTHING;
