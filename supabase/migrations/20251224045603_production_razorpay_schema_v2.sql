-- Update token_transactions for production Razorpay integration
ALTER TABLE public.token_transactions 
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'success';

-- Add index for payment_id lookups (for idempotency check)
CREATE INDEX IF NOT EXISTS idx_token_transactions_razorpay_payment_id ON public.token_transactions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_razorpay_order_id ON public.token_transactions(razorpay_order_id);
