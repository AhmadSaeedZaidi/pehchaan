export interface TavilyResult {
  url: string;
  title: string;
  content: string;
  score?: number;
}

export interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
}

export async function tavilySearch(
  query: string,
  maxResults = 5,
): Promise<TavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return { results: [] };

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
      }),
    });
    if (!res.ok) return { results: [] };
    const data = await res.json();
    return {
      results: (data.results ?? []) as TavilyResult[],
      answer: data.answer,
    };
  } catch {
    return { results: [] };
  }
}

/** Builds a compact context block from retrieved docs for inclusion in LLM prompts. */
export function formatRetrievedContext(
  results: TavilyResult[],
  charBudget = 1800,
): string {
  if (!results.length) return "(no web results retrieved)";
  let out = "";
  for (const [i, r] of results.entries()) {
    const snippet = (r.content ?? "").replace(/\s+/g, " ").trim().slice(0, 320);
    const block = `[${i + 1}] ${r.title}\n${r.url}\n${snippet}\n\n`;
    if (out.length + block.length > charBudget) break;
    out += block;
  }
  return out.trim();
}
