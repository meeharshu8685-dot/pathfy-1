import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    // Service role client for updating data
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      throw new Error('Invalid promo code format');
    }

    const normalizedCode = code.trim().toUpperCase();
    console.log(`User ${user.id} attempting to redeem code: ${normalizedCode}`);

    // Get the promo code
    const { data: promoCode, error: promoError } = await supabaseAdmin
      .from('promo_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .maybeSingle();

    if (promoError) {
      console.error('Promo code lookup error:', promoError);
      throw new Error('Failed to validate promo code');
    }

    if (!promoCode) {
      throw new Error('Invalid or expired promo code');
    }

    // Check if expired
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      throw new Error('This promo code has expired');
    }

    // Check if max uses reached
    if (promoCode.max_uses && promoCode.uses_count >= promoCode.max_uses) {
      throw new Error('This promo code has reached its usage limit');
    }

    // Check if user already redeemed this code
    const { data: existingRedemption, error: redemptionError } = await supabaseAdmin
      .from('promo_code_redemptions')
      .select('id')
      .eq('promo_code_id', promoCode.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (redemptionError) {
      console.error('Redemption check error:', redemptionError);
      throw new Error('Failed to check redemption status');
    }

    if (existingRedemption) {
      throw new Error('You have already redeemed this promo code');
    }

    // Calculate tokens to give
    let tokensToAdd = 0;
    if (promoCode.discount_type === 'free_tokens') {
      tokensToAdd = promoCode.discount_value;
    } else if (promoCode.discount_type === 'percentage') {
      // For percentage, we'll give a percentage of base tokens (e.g., 10 tokens base)
      tokensToAdd = Math.floor(10 * (promoCode.discount_value / 100));
    }

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
    const newBalance = currentTokens + tokensToAdd;

    // Update user tokens
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ tokens: newBalance })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Token update error:', updateError);
      throw new Error('Failed to add tokens');
    }

    // Record redemption
    const { error: recordError } = await supabaseAdmin
      .from('promo_code_redemptions')
      .insert({
        promo_code_id: promoCode.id,
        user_id: user.id,
        tokens_received: tokensToAdd,
      });

    if (recordError) {
      console.error('Redemption record error:', recordError);
      // Don't fail - tokens already added
    }

    // Update promo code usage count
    const { error: usageError } = await supabaseAdmin
      .from('promo_codes')
      .update({ uses_count: promoCode.uses_count + 1 })
      .eq('id', promoCode.id);

    if (usageError) {
      console.error('Usage count update error:', usageError);
      // Don't fail - tokens already added
    }

    // Record token transaction
    const { error: transactionError } = await supabaseAdmin
      .from('token_transactions')
      .insert({
        user_id: user.id,
        amount: tokensToAdd,
        balance_after: newBalance,
        transaction_type: 'credit',
        feature_used: 'promo_code',
        description: `Promo code: ${normalizedCode} - ${promoCode.description || 'Bonus tokens'}`,
      });

    if (transactionError) {
      console.error('Transaction record error:', transactionError);
    }

    console.log(`Successfully redeemed code ${normalizedCode} for user ${user.id}. Added ${tokensToAdd} tokens.`);

    return new Response(
      JSON.stringify({
        success: true,
        tokensReceived: tokensToAdd,
        newBalance: newBalance,
        message: `Successfully redeemed! You received ${tokensToAdd} tokens.`,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error redeeming promo code:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
