import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const authHeader = req.headers.get('Authorization')!
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

        if (userError || !user) throw new Error('Unauthorized')

        const { platform } = await req.json()
        if (!platform) throw new Error('Platform is required')

        // 1. Get current share count
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('share_count, tokens')
            .eq('user_id', user.id)
            .single()

        if (profileError) throw profileError

        const currentShares = (profile.share_count || 0) + 1
        let rewardTokens = 2

        // Extra 10 tokens for every 5 shares
        if (currentShares % 5 === 0) {
            rewardTokens += 10
        }

        const newTokens = profile.tokens + rewardTokens

        // 2. Perform updates in a "transaction" via RPC or multiple calls
        // Update profile
        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
                share_count: currentShares,
                tokens: newTokens,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)

        if (updateError) throw updateError

        // Log share
        await supabaseClient
            .from('shares_log')
            .insert({
                user_id: user.id,
                platform,
                rewarded_tokens: rewardTokens
            })

        // Log token transaction
        await supabaseClient
            .from('token_transactions')
            .insert({
                user_id: user.id,
                amount: rewardTokens,
                balance_after: newTokens,
                transaction_type: 'credit',
                feature_used: 'share_reward',
                description: `Earned ${rewardTokens} tokens for sharing on ${platform}${rewardTokens > 2 ? ' (Bonus included!)' : ''}`
            })

        return new Response(
            JSON.stringify({
                message: `Success! You earned ${rewardTokens} tokens.`,
                share_count: currentShares,
                rewarded_tokens: rewardTokens,
                bonus_milestone: currentShares % 5 === 0
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
