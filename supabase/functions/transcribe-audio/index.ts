import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { audioBase64, mimeType, fileName } = await req.json();

    if (!audioBase64) {
      return new Response(
        JSON.stringify({ error: "No audio data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert music transcription AI. Given an audio file, you must:

1. Listen carefully to the audio and identify all musical notes, rhythms, time signature, and key signature.
2. Output the transcription in ABC notation format.
3. Include proper headers: X (reference number), T (title based on content), M (meter/time signature), L (default note length), K (key), and Q (tempo if detectable).
4. Transcribe the melody as accurately as possible with correct note durations.
5. If there are multiple voices/parts, transcribe the most prominent melody.
6. Use standard ABC notation conventions.

IMPORTANT: Return ONLY the ABC notation text, nothing else. No explanations, no markdown code blocks, just pure ABC notation starting with X:1.

Example output format:
X:1
T:Transcribed Melody
M:4/4
L:1/8
Q:1/4=120
K:C
CDEF GABc|c2B2 A2G2|F2E2 D2C2|C4 z4|`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Please transcribe this audio file (${fileName || "audio"}) into ABC notation. Listen carefully and produce accurate notation.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType || "audio/mpeg"};base64,${audioBase64}`,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to transcribe audio" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const abcNotation = data.choices?.[0]?.message?.content?.trim() || "";

    // Clean up: remove markdown code blocks if present
    let cleanAbc = abcNotation;
    if (cleanAbc.startsWith("```")) {
      cleanAbc = cleanAbc.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
    }

    return new Response(
      JSON.stringify({ abcNotation: cleanAbc }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Transcription error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
