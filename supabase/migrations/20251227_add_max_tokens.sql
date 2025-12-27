-- Add max_tokens column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_tokens INTEGER NOT NULL DEFAULT 50;

-- Update handle_new_user function to include max_tokens
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile with 5 free tokens and default 50 max_tokens
  INSERT INTO public.profiles (user_id, email, full_name, tokens, max_tokens)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    5,
    50
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Record welcome token transaction
  INSERT INTO public.token_transactions (user_id, amount, balance_after, transaction_type, description)
  VALUES (NEW.id, 5, 5, 'credit', 'Welcome bonus - 5 free tokens');
  
  -- If referral was used, bonus is handled by a separate trigger or function
  -- mentioned in 20251227_referral_signup_reward.sql
  
  RETURN NEW;
END;
$$;
