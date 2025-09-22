import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenAI } from "npm:@google/genai";

const ai = new GoogleGenAI({
  apiKey: Deno.env.get("GOOGLE_GEN_AI_API_KEY"),
});

const NUTRIENTS_TEMPLATE = `
You are a nutrition analyzer. Given a description of a food item, provide a structured JSON with the following fields:

{
  "calories": number (kcal),
  "protein": number (grams),
  "carbohydrates": number (grams),
  "sugar": number (grams),
  "fiber": number (grams),
  "fat_total": number (grams),
  "saturated_fat": number (grams),
  "monounsaturated_fat": number (grams),
  "polyunsaturated_fat": number (grams),
  "omega3": number (grams),
  "omega6": number (grams),
  "vitamin_c": number (mg),
  "vitamin_a": number (µg),
  "vitamin_d": number (µg),
  "vitamin_b12": number (µg),
  "calcium": number (mg),
  "iron": number (mg),
  "magnesium": number (mg),
  "potassium": number (mg),
  "sodium": number (mg),
  "polyphenols": number (mg),
  "trans_fat": number (grams)
}

Rules:
- Include only nutrients that have significant health impact.
- If a value is unknown, return 0.
- Do not include unnecessary elements.
- Output only valid JSON, no extra text.
`;

function extractJson(input: string) {
  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No valid JSON object found");
  }

  const jsonString = input.slice(start, end + 1);
  return JSON.parse(jsonString);
}

async function executeWithGoogle(imageBase64: string | null, userPrompt: string) {
  const parts: any[] = [{ text: userPrompt }];

  if (imageBase64) {
    parts.push({
      inlineData: { mimeType: "image/jpeg", data: imageBase64 },
    });
  }

  const response = await ai.models.generateContent({
    model: Deno.env.get("GOOGLE_BASE_MODEL_NAME") ?? "gemini-1.5-flash",
    contents: [{ role: "user", parts }],
    config: { temperature: 0.3, topP: 0.9, topK: 40 },
  });

  const rawText =
    response.candidates
      ?.map((c) => c.content?.parts?.map((p) => p.text).join("\n"))
      .join("\n") || "";

  return extractJson(rawText);
}

Deno.serve(async (req) => {
  try {
    const { description, imageBase64 } = await req.json();

    if (!description && !imageBase64) {
      return new Response(
        JSON.stringify({ error: "Missing description or imageBase64" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const nutrients = await executeWithGoogle(imageBase64, `${NUTRIENTS_TEMPLATE}\nFood description: ${description}`);

    return new Response(JSON.stringify(nutrients), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
