import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Token pack config (Must match create-razorpay-order)
const TOKEN_PACKS: Record<number, number> = {
    4900: 10,
    9900: 25,
    19900: 60
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('RAZORPAY_WEBHOOK_SECRET not configured');
        }

        const signature = req.headers.get('x-razorpay-signature');
        if (!signature) {
            throw new Error('Missing Razorpay signature');
        }

        const rawBody = await req.text();

        // Verify Signature
        // In Deno, we use subtle crypto for HMAC-SHA256
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(webhookSecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const generatedSignatureBuffer = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(rawBody)
        );

        const generatedSignature = Array.from(new Uint8Array(generatedSignatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (generatedSignature !== signature) {
            console.error('Invalid signature');
            return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
        }

        const event = JSON.parse(rawBody);
        console.log(`Received Razorpay event: ${event.event}`);

        // We only care about payment.captured
        if (event.event !== 'payment.captured') {
            return new Response(JSON.stringify({ status: 'ignored' }), { status: 200 });
        }

        const payment = event.payload.payment.entity;
        const { id: payment_id, order_id, amount, notes, status } = payment;
        const user_id = notes.user_id;

        if (!user_id) {
            console.error('No user_id in payment notes');
            return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
        }

        // Initialize Supabase Admin
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SB_SERVICE_ROLE_KEY')!;
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Check for Idempotency (Has this payment already been processed?)
        const { data: existingTx } = await supabaseAdmin
            .from('token_transactions')
            .select('id')
            .eq('razorpay_payment_id', payment_id)
            .single();

        if (existingTx) {
            console.log(`Payment ${payment_id} already processed. Skipping.`);
            return new Response(JSON.stringify({ status: 'duplicate' }), { status: 200 });
        }

        // 2. Determine Tokens (Server-side mapping)
        const tokensCredited = TOKEN_PACKS[amount];
        if (!tokensCredited) {
            console.error(`Unknown amount: ${amount}`);
            return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
        }

        // 3. Credit Tokens & Log Transaction (Atomic)
        // We fetch profile first to calculate balance_after
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('tokens')
            .eq('user_id', user_id)
            .single();

        if (profileError || !profile) {
            console.error('Profile not found');
            throw new Error('User profile not found');
        }

        const newBalance = (profile.tokens || 0) + tokensCredited;

        // Perform updates
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ tokens: newBalance })
            .eq('user_id', user_id);

        if (updateError) throw updateError;

        const { error: txError } = await supabaseAdmin
            .from('token_transactions')
            .insert({
                user_id,
                amount: tokensCredited,
                balance_after: newBalance,
                transaction_type: 'credit',
                description: `Purchased ${tokensCredited} tokens (₹${amount / 100})`,
                razorpay_payment_id: payment_id,
                razorpay_order_id: order_id,
                status: 'success'
            });

        if (txError) throw txError;

        console.log(`Successfully credited ${tokensCredited} tokens to user ${user_id}`);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
