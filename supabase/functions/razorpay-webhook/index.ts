import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Token pack config by amount in paise (Must match create-razorpay-order + Payment Links)
const TOKEN_PACKS: Record<number, number> = {
    4900: 10,   // ₹49 = 10 tokens
    9900: 25,   // ₹99 = 25 tokens (Growth Plan / Payment Link)
    19900: 60   // ₹199 = 60 tokens
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

        // Verify Signature using HMAC-SHA256
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

        // Initialize Supabase Admin
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SB_SERVICE_ROLE_KEY')!;
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        let payment_id: string;
        let order_id: string | null = null;
        let amount: number;
        let user_id: string | null = null;
        let user_email: string | null = null;

        // Handle different event types
        if (event.event === 'payment.captured') {
            // Standard API checkout flow
            const payment = event.payload.payment.entity;
            payment_id = payment.id;
            order_id = payment.order_id;
            amount = payment.amount;
            user_id = payment.notes?.user_id || null;
            user_email = payment.email || null;

            console.log(`Processing payment.captured: ${payment_id}, amount: ${amount}, user_id: ${user_id}`);

        } else if (event.event === 'payment_link.paid') {
            // Payment Link flow (for Growth Plan external link)
            const paymentLink = event.payload.payment_link.entity;
            const payment = event.payload.payment.entity;

            payment_id = payment.id;
            amount = paymentLink.amount;
            user_email = payment.email || paymentLink.customer?.email || null;

            console.log(`Processing payment_link.paid: ${payment_id}, amount: ${amount}, email: ${user_email}`);

        } else {
            // Ignore other events
            return new Response(JSON.stringify({ status: 'ignored' }), { status: 200 });
        }

        // Check for Idempotency (Has this payment already been processed?)
        const { data: existingTx } = await supabaseAdmin
            .from('token_transactions')
            .select('id')
            .eq('razorpay_payment_id', payment_id)
            .single();

        if (existingTx) {
            console.log(`Payment ${payment_id} already processed. Skipping.`);
            return new Response(JSON.stringify({ status: 'duplicate' }), { status: 200 });
        }

        // Determine Tokens (Server-side mapping)
        const tokensCredited = TOKEN_PACKS[amount];
        if (!tokensCredited) {
            console.error(`Unknown amount: ${amount} paise`);
            return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
        }

        // Find user - try by user_id first, then by email
        if (!user_id && user_email) {
            console.log(`Looking up user by email: ${user_email}`);
            const { data: authUser } = await supabaseAdmin.auth.admin.listUsers();
            const matchedUser = authUser?.users?.find(u => u.email?.toLowerCase() === user_email.toLowerCase());
            if (matchedUser) {
                user_id = matchedUser.id;
                console.log(`Found user by email: ${user_id}`);
            }
        }

        if (!user_id) {
            console.error('Could not identify user for payment');
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
        }

        // Fetch profile to calculate new balance
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('tokens')
            .eq('user_id', user_id)
            .single();

        if (profileError || !profile) {
            console.error('Profile not found for user:', user_id);
            throw new Error('User profile not found');
        }

        const newBalance = (profile.tokens || 0) + tokensCredited;

        // Credit Tokens
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ tokens: newBalance })
            .eq('user_id', user_id);

        if (updateError) throw updateError;

        // Log Transaction
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

        console.log(`Successfully credited ${tokensCredited} tokens to user ${user_id}. New balance: ${newBalance}`);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});

