import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  tokens: number;
  planId: string;
  amount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseServiceKey) {
      console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not configured as a secret');
      throw new Error('Server configuration error: missing service key');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Service role client for updating tokens
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tokens,
      planId,
      amount
    }: VerifyRequest = await req.json();

    console.log(`Verifying payment for user ${user.id}, order: ${razorpay_order_id}`);

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpayKeySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );

    const generatedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature verification failed');
      throw new Error('Payment verification failed: Invalid signature');
    }

    console.log('Signature verified successfully');

    // Get current user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('tokens')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    const currentTokens = profile?.tokens ?? 0;
    const newBalance = currentTokens + tokens;

    // Update user tokens
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ tokens: newBalance })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Token update error:', updateError);
      throw new Error('Failed to update tokens');
    }

    // Record transaction
    const { error: transactionError } = await supabaseAdmin
      .from('token_transactions')
      .insert({
        user_id: user.id,
        amount: tokens,
        balance_after: newBalance,
        transaction_type: 'credit',
        feature_used: 'razorpay_purchase',
        description: `Purchased ${tokens} tokens - ${planId} plan (₹${amount})`,
      });

    if (transactionError) {
      console.error('Transaction record error:', transactionError);
      // Don't fail the whole operation if transaction logging fails
    }

    console.log(`Payment verified. Added ${tokens} tokens. New balance: ${newBalance}`);

    return new Response(
      JSON.stringify({
        success: true,
        tokens: tokens,
        newBalance: newBalance,
        paymentId: razorpay_payment_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
