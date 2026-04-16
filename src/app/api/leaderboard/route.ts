import { NextResponse } from "next/server";
import { MODELS } from "@/data/models";

// Revalidate once per day — respect HuggingFace rate limits
export const revalidate = 86400;

// HuggingFace Open LLM Leaderboard — free, no auth required for public datasets
const HF_DATASET_URL =
  "https://datasets-server.huggingface.co/rows?dataset=open-llm-leaderboard%2Fcontents&config=default&split=train&offset=0&length=100";

// Map our model IDs to the names used on the Open LLM Leaderboard
// (Claude, GPT-4o, Grok are closed-source and NOT on the open leaderboard;
//  we keep their static ELO scores and only update open models from HF)
const HF_MODEL_MAP: Record<string, string[]> = {
  llama: ["meta-llama/Llama-3.3-70B", "meta-llama/Meta-Llama-3"],
  minimax: ["MiniMaxAI/MiniMax-Text-01"],
  kimi: ["moonshotai/Kimi"],
};

export interface LeaderboardEntry {
  modelId: string;
  name: string;
  provider: string;
  arenaElo: number;
  rank: number;
  source: "hf-leaderboard" | "lmsys-static";
  color: string;
}

export async function GET() {
  // Start with our curated static ELO data as the base
  const entries: LeaderboardEntry[] = MODELS.map((m) => ({
    modelId: m.id,
    name: m.name,
    provider: m.provider,
    arenaElo: m.arenaElo,
    rank: 0, // assigned below
    source: "lmsys-static" as const,
    color: m.providerColor,
  }));

  // Attempt to enrich open-source models with live HF leaderboard data
  try {
    const res = await fetch(HF_DATASET_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      const rows: Array<{ row: Record<string, unknown> }> = data.rows ?? [];

      for (const [modelId, hfNames] of Object.entries(HF_MODEL_MAP)) {
        const match = rows.find((r) =>
          hfNames.some((name) =>
            String(r.row["model"] ?? r.row["Model"] ?? "")
              .toLowerCase()
              .includes(name.toLowerCase())
          )
        );
        if (match) {
          const avgScore =
            Number(match.row["Average ⬆️"] ?? match.row["average_score"] ?? 0);
          if (avgScore > 0) {
            const entry = entries.find((e) => e.modelId === modelId);
            if (entry) {
              // Convert avg benchmark score (0-100) to approximate ELO range
              // LMSYS ELO typically 1100-1400; avg scores ~50-90 → map linearly
              entry.arenaElo = Math.round(1100 + (avgScore / 100) * 300);
              entry.source = "hf-leaderboard";
            }
          }
        }
      }
    }
  } catch {
    // HF fetch failed — serve static data; no error surfaced to client
  }

  // Sort by ELO and assign ranks
  entries.sort((a, b) => b.arenaElo - a.arenaElo);
  entries.forEach((e, i) => (e.rank = i + 1));

  return NextResponse.json({
    entries,
    updatedAt: new Date().toISOString(),
  });
}
