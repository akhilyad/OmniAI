"use client";

import useSWR from "swr";
import { MODELS } from "@/data/models";
import type { LeaderboardEntry } from "@/app/api/leaderboard/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Static fallback — shown immediately, refreshed by live API
const STATIC_ENTRIES: LeaderboardEntry[] = [...MODELS]
  .sort((a, b) => b.arenaElo - a.arenaElo)
  .map((m, i) => ({
    modelId: m.id,
    name: m.name,
    provider: m.provider,
    arenaElo: m.arenaElo,
    rank: i + 1,
    source: "lmsys-static",
    color: m.providerColor,
  }));

export function LeaderBoard() {
  const { data, isLoading } = useSWR<{
    entries: LeaderboardEntry[];
    updatedAt: string;
  }>("/api/leaderboard", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 86_400_000, // 24h
    fallbackData: { entries: STATIC_ENTRIES, updatedAt: "" },
  });

  const entries = data?.entries ?? STATIC_ENTRIES;
  const hasLiveData = entries.some((e) => e.source === "hf-leaderboard");
  const maxElo = entries[0]?.arenaElo ?? 1;

  return (
    <div className="bg-bbg-surface border border-bbg-border rounded p-4 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-bbg-dim uppercase tracking-wider">
          Arena ELO Leaderboard
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-[10px] text-bbg-muted">fetching…</span>
          )}
          <span
            className={`text-[10px] border px-2 py-0.5 rounded ${
              hasLiveData
                ? "bg-bbg-green/10 text-bbg-green border-bbg-muted"
                : "bg-black text-bbg-muted border-bbg-border"
            }`}
          >
            {hasLiveData ? "● HF LIVE" : "● LMSYS STATIC"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const pct = (entry.arenaElo / maxElo) * 100;
          return (
            <div key={entry.modelId} className="flex items-center gap-2 sm:gap-3">
              <span className="text-bbg-muted text-[11px] w-4 text-right font-bold shrink-0">
                {entry.rank}
              </span>
              <div className="w-16 sm:w-24 shrink-0 min-w-0">
                <div
                  className="text-[11px] font-bold truncate"
                  style={{ color: entry.color }}
                >
                  {entry.name}
                </div>
                <div className="text-[10px] text-bbg-muted truncate">{entry.provider}</div>
              </div>
              <div className="flex-1 bg-bbg-border rounded-full h-2 overflow-hidden min-w-0">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: entry.color }}
                />
              </div>
              <div className="text-right w-14 sm:w-20 shrink-0">
                <div className="text-bbg-green text-[11px] font-bold">
                  {entry.arenaElo.toLocaleString()}
                </div>
                {entry.source === "hf-leaderboard" && (
                  <div className="text-[9px] text-bbg-mid hidden sm:block">HF LIVE</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-bbg-muted mt-4">
        {hasLiveData
          ? "Open-source models: HuggingFace Open LLM Leaderboard · Closed models: LMSYS Arena"
          : "Source: LMSYS Chatbot Arena · Updated daily from HuggingFace"}
      </div>
    </div>
  );
}
