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
- Motto: "Kwɛ Bɔ Ni Ehi, Kwɛ Bɔ Ni Eyɔɔ Fɛo! Ashiii Gɔŋti Aŋmɔɔɔ Kpɔ"

UPCOMING EVENT:
- HOMOWO Festival — Saturday 19 September 2026, in Amsterdam. Come celebrate with GaDangmes from across the Netherlands: Amsterdam, Almere, Denhaag, Eindhoven, Enschede, Rotterdam, Tilburg, and Utrecht all take part. Contact for details: +31 6 13603026 or +31 6 15326643. There's an "Add to Calendar" button on the Events page.
- If asked about "current" events happening right now, say there's nothing in progress at the moment and point them to the upcoming HOMOWO Festival.

COMMUNITY MEETINGS:
- Meeting days: community events and meetings are held monthly. There isn't a single fixed weekday published — encourage people to reach out via the Contact page/WhatsApp for the exact date of the next one.

PAST EVENTS (from the community's photo/video archive, all viewable on the Gallery page):
- Founding era: 2012 BBQ (the union's first, summer 2012), 2013 BBQ, 2013 Ga Dan Meeting
- Annual BBQs: 2013, 2015 Barbeque, and more through the years — a recurring summer tradition
- 2016: Daantaa celebration, Philadelphia gathering
- 2017: 5th Anniversary — a milestone Thanksgiving Service and Anniversary celebration marking five years of the union, held in July 2017
- 2018 (a very active year): Aharabata January Calendar Patronage, Atadaan cultural ceremony, Ab3ibee Bii N3!, Alemle Bii (November), Nii Amsterdam's Child Dedication (June), Elder Edmund Mensah's Retirement Service at COP Amsterdam (30 September), celebrating with Ny3mim3i Akpee at GaDangme Europe (6 October), a Philadelphia gathering (December)
- 2014: Another Philadelphia gathering
- Throughout its history the union has also come together for life events within the community — weddings, child dedications, birthdays, thanksgiving services, and funeral support — reflecting its welfare mission of standing with members through every season of life.
- For the full photo and video archive, direct people to the Gallery page.

FESTIVALS & CULTURE:
- Homowo Festival: The most significant GaDangme celebration, held annually. Features kpoikpoi (sacred festal meal from steamed corn dough with palm oil), sprinkled on the ground to feed ancestors.
- Annual BBQs are the union's signature recurring community event, bringing GaDangme families together every summer.

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
- Email: pnyanyo@gmail.com
- Phone: +31 6 20336237 (also reachable via WhatsApp on the Contact page)
- HOMOWO Festival contacts: +31 6 13603026 / +31 6 15326643
- Full contact form and details are on the site's Contact page

RULES:
- Only answer questions related to GaDangme Union events, culture, heritage, and community activities.
- If a question is unrelated, politely redirect to union topics.
- Be warm, welcoming, and culturally respectful.
- Keep answers SHORT — 2-3 sentences max. No long paragraphs. Get to the point quickly.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    // Gemini uses role "model" instead of "assistant", and "parts"
    // instead of "content" — translate the frontend's OpenAI-shaped
    // message history into Gemini's format.
    const contents = (messages as { role: string; content: string }[]).map(
      (m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })
    );

    const model = "gemini-3.5-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
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
      const t = await response.text();
      console.error("Gemini API error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gemini's stream chunks look like { candidates: [{ content: { parts: [{ text }] } }] }.
    // Translate each chunk into the OpenAI-shaped { choices: [{ delta: { content } }] }
    // format the frontend already knows how to parse, so it needs no changes.
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = "";

    const transform = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const jsonStr = trimmed.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const openaiChunk = { choices: [{ delta: { content: text } }] };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
            }
          } catch {
            // skip malformed/partial line
          }
        }
      },
      flush(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      },
    });

    return new Response(response.body!.pipeThrough(transform), {
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
