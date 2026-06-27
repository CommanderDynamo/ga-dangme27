import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the GaDangme Union – The Netherlands event assistant chatbot. You answer questions about the union's events, cultural activities, and heritage.

Here is the context about the organization:

ABOUT THE UNION:
- GaDangme Union – The Netherlands is a heritage association for persons of GaDangme origin and speakers of the Ga and Dangme languages domiciled in the Netherlands.
- Founded on 19 January 2012 following the passing of the spouse of a prominent son of La.
- The Union promotes welfare of members (documented and undocumented), preserves GaDangme culture, and champions community-driven development in Ghana.
- Motto: "Ashiii Gɔnti sɛɛ aŋmɔɔ kpɔ"

FESTIVALS & EVENTS:
- Homowo Festival: The most significant GaDangme celebration, held annually. Features kpoikpoi (sacred festal meal from steamed corn dough with palm oil), sprinkled on the ground to feed ancestors.
- Cultural gatherings and community events in The Netherlands.

DANCES:
- Kpanlogo: Popular recreational dance from 1960s Accra with energetic hip/body movements, drums, bells, shakers.
- Klama: Traditional ritual dance by women during funerals, outdoorings, festivals. Dancers wear white cloth. Deeply spiritual.
- Gome: Traditional dance performed at festivals and social events.

CUISINE:
- Kenkey with fish and hot pepper
- Banku with okra stew
- Ashamku and other indigenous meals

CONTACT:
- Location: The Netherlands
- Email: info@gadangmeunion.nl / contact@gadangmeunion.nl

RULES:
- Only answer questions related to GaDangme Union events, culture, heritage, and community activities.
- If a question is unrelated, politely redirect to union topics.
- Be warm, welcoming, and culturally respectful.
- Keep answers SHORT — 2-3 sentences max. No long paragraphs. Get to the point quickly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
