"use client";

import { MODELS } from "@/data/models";
import { formatPrice } from "@/lib/utils";

export function LeaderBoard() {
  const ranked = [...MODELS].sort((a, b) => b.arenaElo - a.arenaElo);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 font-mono">
      <div className="text-xs text-zinc-400 mb-4 uppercase tracking-wider">
        Arena ELO Leaderboard
      </div>
      <div className="space-y-2">
        {ranked.map((model, i) => {
          const maxElo = ranked[0].arenaElo;
          const pct = (model.arenaElo / maxElo) * 100;
          return (
            <div key={model.id} className="flex items-center gap-3">
              <span className="text-zinc-600 text-[11px] w-4 text-right">
                {i + 1}
              </span>
              <span className="text-[11px] w-24" style={{ color: model.providerColor }}>
                {model.name}
              </span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: model.providerColor }}
                />
              </div>
              <span className="text-yellow-400 text-[11px] font-bold w-12 text-right">
                {model.arenaElo}
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-zinc-600 mt-4">
        Source: LMSYS Chatbot Arena — updated Apr 2025
      </div>
    </div>
  );
}
