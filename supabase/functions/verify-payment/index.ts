
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
    const { sessionId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Initialize Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const paymentType = session.metadata?.type || "lesson";
    let newStatus = "";
    
    if (paymentType === "classroom") {
      // Handle classroom enrollment payment
      if (session.payment_status === "paid") {
        // Create the enrollment only after successful payment
        await supabaseService.from("classroom_enrollments").insert({
          student_id: session.metadata?.studentId,
          classroom_id: session.metadata?.classroomId,
          status: "active"
        });
        
        console.log("Classroom enrollment created for:", session.metadata?.studentId);
      }
    } else {
      // Handle lesson booking payment (existing logic)
      newStatus = session.payment_status === "paid" ? "confirmed" : "cancelled";

      await supabaseService
        .from("lesson_bookings")
        .update({ status: newStatus })
        .eq("student_id", session.metadata?.studentId)
        .eq("teacher_id", session.metadata?.teacherId)
        .eq("lesson_date", session.metadata?.lessonDate);
    }

    // Send appropriate email based on payment status
    if (session.payment_status === "paid") {
      if (paymentType === "classroom") {
        // Send classroom enrollment confirmation
        await supabaseService.functions.invoke("send-payment-confirmation", {
          body: {
            email: session.customer_details?.email,
            type: "classroom",
            classroomName: session.line_items?.data[0]?.description?.replace("Classroom Enrollment: ", "") || "Classroom",
            duration: session.metadata?.duration,
            amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0",
          },
        });
      } else {
        // Send lesson booking confirmation (existing logic)
        await supabaseService.functions.invoke("send-payment-confirmation", {
          body: {
            email: session.customer_details?.email,
            type: "lesson",
            teacherName: session.line_items?.data[0]?.description?.split(" with ")[1]?.split(" ")[0] || "Teacher",
            lessonDate: session.metadata?.lessonDate,
            duration: session.metadata?.duration,
            amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0",
          },
        });
      }
    }

    console.log("Payment verified and booking updated:", sessionId);

    return new Response(JSON.stringify({ 
      status: session.payment_status,
      paymentType: paymentType,
      ...(paymentType === "lesson" ? { bookingStatus: newStatus } : { enrollmentCreated: session.payment_status === "paid" })
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
