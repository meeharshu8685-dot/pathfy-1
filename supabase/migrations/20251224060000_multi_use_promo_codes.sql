-- Add max_uses_per_user column to promo_codes table
ALTER TABLE public.promo_codes 
ADD COLUMN IF NOT EXISTS max_uses_per_user INTEGER DEFAULT 1;

-- Insert the requested promo codes
INSERT INTO public.promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    max_uses,
    max_uses_per_user,
    expires_at,
    is_active
) VALUES 
(
    'SIMRAN', 
    'Special Promo', 
    'free_tokens', 
    200, 
    300, -- 100 users * 3 uses
    3,   -- 3 uses per user
    NOW() + INTERVAL '1 year', 
    true
),
(
    'HARSHU', 
    'Special Promo', 
    'free_tokens', 
    200, 
    300, 
    3, 
    NOW() + INTERVAL '1 year', 
    true
),
(
    'ABHI', 
    'Special Promo', 
    'free_tokens', 
    200, 
    300, 
    3, 
    NOW() + INTERVAL '1 year', 
    true
);
