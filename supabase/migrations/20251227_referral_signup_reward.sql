-- Add referred_by to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- Update handle_new_user function to reward referrer
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_referrer_id UUID;
    v_referrer_tokens INTEGER;
BEGIN
    -- Extract referred_by from metadata
    v_referrer_id := (NEW.raw_user_meta_data->>'referred_by')::UUID;

    -- Create profile with 5 free tokens
    INSERT INTO public.profiles (user_id, email, full_name, tokens, referred_by)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        5,
        v_referrer_id
    );
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    -- Record welcome token transaction
    INSERT INTO public.token_transactions (user_id, amount, balance_after, transaction_type, description)
    VALUES (NEW.id, 5, 5, 'credit', 'Welcome bonus - 5 free tokens');

    -- If there's a referrer, give them 5 tokens
    IF v_referrer_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = v_referrer_id) THEN
        -- Get current tokens of referrer
        SELECT tokens INTO v_referrer_tokens FROM public.profiles WHERE user_id = v_referrer_id;
        
        -- Update referrer's tokens
        UPDATE public.profiles 
        SET tokens = tokens + 5,
            updated_at = now()
        WHERE user_id = v_referrer_id;

        -- Record referral reward for referrer
        INSERT INTO public.token_transactions (user_id, amount, balance_after, transaction_type, feature_used, description)
        VALUES (v_referrer_id, 5, v_referrer_tokens + 5, 'credit', 'referral_reward', 'Referral reward - 5 tokens for inviting ' || COALESCE(NEW.email, 'a new user'));
    END IF;
    
    RETURN NEW;
END;
$$;
