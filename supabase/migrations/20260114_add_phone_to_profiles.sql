-- Add phone column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update handle_new_user to sync phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile with 5 free tokens
  INSERT INTO public.profiles (user_id, email, full_name, phone, tokens)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'phone',
    5
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Record welcome token transaction
  INSERT INTO public.token_transactions (user_id, amount, balance_after, transaction_type, description)
  VALUES (NEW.id, 5, 5, 'credit', 'Welcome bonus - 5 free tokens');
  
  RETURN NEW;
END;
$$;
