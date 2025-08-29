
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import Stripe from "https://deno.land/x/stripe@v0.24.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update booking status based on payment status
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const newStatus = session.payment_status === "paid" ? "confirmed" : "cancelled";

    await supabaseService
      .from("lesson_bookings")
      .update({ status: newStatus })
      .eq("student_id", session.metadata?.studentId)
      .eq("teacher_id", session.metadata?.teacherId)
      .eq("lesson_date", session.metadata?.lessonDate);

    // Send appropriate email based on payment status
    if (session.payment_status === "paid") {
      await supabaseService.functions.invoke("send-payment-confirmation", {
        body: {
          email: session.customer_details?.email,
          teacherName: session.line_items?.data[0]?.description?.split(" with ")[1]?.split(" ")[0] || "Teacher",
          lessonDate: session.metadata?.lessonDate,
          duration: session.metadata?.duration,
          amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0",
        },
      });
    }

    console.log("Payment verified and booking updated:", sessionId);

    return new Response(JSON.stringify({ 
      status: session.payment_status,
      bookingStatus: newStatus 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
