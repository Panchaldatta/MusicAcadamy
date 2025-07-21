
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  email: string;
  teacherName: string;
  lessonDate: string;
  duration: string;
  amount: string;
  type?: 'success' | 'failure' | 'pending';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, teacherName, lessonDate, duration, amount, type = 'success' }: PaymentEmailRequest = await req.json();

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    let subject = "";
    let html = "";

    switch (type) {
      case 'success':
        subject = "🎉 Lesson Booking Confirmed - Payment Successful!";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🎵 Lesson Booking Confirmed!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Great news! Your payment was successful.</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
                <h3 style="color: #f97316; margin-top: 0;">Lesson Details:</h3>
                <p><strong>Teacher:</strong> ${teacherName}</p>
                <p><strong>Date & Time:</strong> ${formatDate(lessonDate)}</p>
                <p><strong>Duration:</strong> ${duration} minutes</p>
                <p><strong>Amount Paid:</strong> ₹${amount}</p>
              </div>
              
              <div style="margin: 20px 0; padding: 15px; background: #e6f7ff; border-radius: 8px;">
                <p style="margin: 0; color: #0066cc;"><strong>📅 What's Next?</strong></p>
                <p style="margin: 5px 0; color: #333;">Your teacher will contact you soon with lesson preparation details and any specific instructions.</p>
              </div>
              
              <p style="color: #666;">If you have any questions, please don't hesitate to contact us.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 14px;">Thank you for choosing our music education platform!</p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'failure':
        subject = "❌ Lesson Booking - Payment Failed";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">❌ Payment Failed</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">We couldn't process your payment</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <h3 style="color: #dc2626; margin-top: 0;">Attempted Booking:</h3>
                <p><strong>Teacher:</strong> ${teacherName}</p>
                <p><strong>Date & Time:</strong> ${formatDate(lessonDate)}</p>
                <p><strong>Duration:</strong> ${duration} minutes</p>
                <p><strong>Amount:</strong> ₹${amount}</p>
              </div>
              
              <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 8px;">
                <p style="margin: 0; color: #856404;"><strong>🔄 What can you do?</strong></p>
                <p style="margin: 5px 0; color: #333;">• Check your payment method and try again</p>
                <p style="margin: 5px 0; color: #333;">• Contact your bank if the issue persists</p>
                <p style="margin: 5px 0; color: #333;">• Reach out to our support team for assistance</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="#" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Try Booking Again</a>
              </div>
            </div>
          </div>
        `;
        break;

      case 'pending':
        subject = "⏳ Lesson Booking - Payment Pending";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">⏳ Payment Processing</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Your payment is being processed</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h3 style="color: #f59e0b; margin-top: 0;">Booking Details:</h3>
                <p><strong>Teacher:</strong> ${teacherName}</p>
                <p><strong>Date & Time:</strong> ${formatDate(lessonDate)}</p>
                <p><strong>Duration:</strong> ${duration} minutes</p>
                <p><strong>Amount:</strong> ₹${amount}</p>
              </div>
              
              <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px;">
                <p style="margin: 0; color: #92400e;"><strong>⏰ Please wait</strong></p>
                <p style="margin: 5px 0; color: #333;">We're processing your payment. You'll receive a confirmation email once it's complete.</p>
                <p style="margin: 5px 0; color: #333;">This usually takes a few minutes.</p>
              </div>
            </div>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "Music Lessons <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
