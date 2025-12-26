import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Promo code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // Find the promo code
    const { data: promoCode, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .single();

    if (promoError || !promoCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive promo code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if code has expired
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This promo code has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if max uses exceeded
    if (promoCode.current_uses >= promoCode.max_uses) {
      return new Response(
        JSON.stringify({ error: 'This promo code has reached its maximum uses' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already used this code
    const { data: existingRedemption } = await supabase
      .from('promo_code_redemptions')
      .select('id')
      .eq('promo_code_id', promoCode.id)
      .eq('user_id', user.id)
      .single();

    if (existingRedemption) {
      return new Response(
        JSON.stringify({ error: 'You have already used this promo code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Start transaction-like operations
    // 1. Record the redemption
    const { error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .insert({
        promo_code_id: promoCode.id,
        user_id: user.id
      });

    if (redemptionError) {
      console.error('Redemption error:', redemptionError);
      return new Response(
        JSON.stringify({ error: 'Failed to redeem promo code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Increment the usage count
    const { error: updateError } = await supabase
      .from('promo_codes')
      .update({ current_uses: promoCode.current_uses + 1 })
      .eq('id', promoCode.id);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    // 3. Add tokens to user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('user_id', user.id)
      .single();

    const currentTokens = profile?.tokens || 0;
    const newBalance = currentTokens + promoCode.tokens_awarded;

    const { error: tokenError } = await supabase
      .from('profiles')
      .update({ tokens: newBalance })
      .eq('user_id', user.id);

    if (tokenError) {
      console.error('Token update error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to add tokens' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Log the transaction
    await supabase
      .from('token_transactions')
      .insert({
        user_id: user.id,
        amount: promoCode.tokens_awarded,
        balance_after: newBalance,
        transaction_type: 'credit',
        description: `Promo code redeemed: ${normalizedCode}`
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully redeemed! ${promoCode.tokens_awarded} tokens added to your account.`,
        tokens_awarded: promoCode.tokens_awarded
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Promo code error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error?.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
