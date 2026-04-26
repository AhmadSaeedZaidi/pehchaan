// Reusable Gemini wrapper with custom system instructions.
// Uses Gemma which doesn't support a separate `systemInstruction` field —
// so we prepend the role/instructions to the user message.

const GEMINI_MODEL = "gemma-4-31b-it";

interface GeminiPart {
  text?: string;
  thought?: boolean;
}

export interface GeminiCallOptions {
  systemInstructions: string;
  userMessage: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export async function callGemini(opts: GeminiCallOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set");

  const composedPrompt =
    `### ROLE & INSTRUCTIONS\n${opts.systemInstructions.trim()}\n\n` +
    `### TASK\n${opts.userMessage.trim()}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: composedPrompt }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.2,
        maxOutputTokens: opts.maxOutputTokens ?? 2048,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 400)}`);
  }

  const data = await res.json();
  const parts: GeminiPart[] = data.candidates?.[0]?.content?.parts ?? [];
  // Gemma may emit `thought: true` parts; pick the first non-thought part with text
  const text =
    parts.find((p) => !p.thought && p.text)?.text ??
    parts.find((p) => p.text)?.text;
  if (!text) throw new Error("No text content in Gemini response");
  return text;
}

/**
 * Robustly parse JSON from an LLM response, tolerating markdown fences
 * and surrounding prose by extracting the first {...} block.
 */
export function parseJsonResponse<T = unknown>(rawText: string): T {
  let cleaned = rawText.trim();

  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  // If the model wrapped the JSON in prose, extract the largest {...} block
  if (!cleaned.startsWith("{")) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) cleaned = cleaned.slice(start, end + 1);
  }

  return JSON.parse(cleaned) as T;
}
