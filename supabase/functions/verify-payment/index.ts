import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Create service client for database operations
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Get the transaction
      const { data: transaction } = await supabaseService
        .from("transactions")
        .select("*")
        .eq("stripe_session_id", session_id)
        .eq("user_id", user.id)
        .single();

      if (transaction && transaction.status === "pending") {
        // Update transaction status
        await supabaseService
          .from("transactions")
          .update({ status: "completed" })
          .eq("id", transaction.id);

        // Get or create wallet
        let { data: wallet } = await supabaseService
          .from("wallets")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!wallet) {
          const { data: newWallet } = await supabaseService
            .from("wallets")
            .insert({ user_id: user.id, balance: 0 })
            .select()
            .single();
          wallet = newWallet;
        }

        // Update wallet balance
        const newBalance = parseFloat(wallet.balance) + parseFloat(transaction.amount);
        await supabaseService
          .from("wallets")
          .update({ 
            balance: newBalance, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", wallet.id);

        return new Response(JSON.stringify({ 
          success: true, 
          amount: transaction.amount,
          new_balance: newBalance 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});