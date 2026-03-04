import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **ApexMortgage AI Advisor**, an expert US mortgage assistant. Your role is to help users with:

1. **Mortgage Guidance** – Explain loan types (Conventional, FHA, VA, USDA, Jumbo), rates, terms, qualification criteria, and the home-buying process step by step.
2. **Loan Status Inquiries** – When users ask about their loan status, explain typical stages (Pre-Approval → Processing → Underwriting → Conditional Approval → Clear to Close → Closing). Since you don't have access to real loan data, guide them on what to expect and suggest contacting their loan officer for specifics.
3. **Documentation Requirements** – Detail required documents for different loan types: pay stubs, W-2s, tax returns, bank statements, ID, employment verification, gift letters, etc.
4. **Rate & Payment Questions** – Help users understand interest rates, APR, points, PMI, escrow, and how different factors affect monthly payments.
5. **Refinancing Advice** – Explain when refinancing makes sense, break-even analysis, cash-out vs rate-and-term refinance.

**Rules:**
- Always be professional, empathetic, and clear.
- Use plain language; avoid excessive jargon. When using industry terms, briefly define them.
- If a question is outside your expertise (legal advice, tax advice, specific investment recommendations), politely redirect to the appropriate professional.
- Never guarantee loan approval or specific rates.
- Format responses with markdown: use **bold** for key terms, bullet lists for documents/steps, and headers for long answers.
- Keep answers concise but thorough. Aim for 2-4 paragraphs unless more detail is needed.
- Always end with a helpful follow-up question or next step suggestion.`;

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
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
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
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mortgage-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
