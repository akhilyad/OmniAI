"use client";

import { useState } from "react";
import { USE_CASES, MODELS } from "@/data/models";

export function UseCaseRecommender() {
  const [selected, setSelected] = useState<string | null>(null);

  const useCase = USE_CASES.find((u) => u.id === selected);
  const topModels = useCase
    ? MODELS.filter((m) => useCase.topModels.includes(m.id))
    : [];

  return (
    <div className="bg-bbg-surface border border-bbg-border rounded p-4 font-mono">
      <div className="text-xs text-bbg-dim mb-1 uppercase tracking-wider">
        Use Case Recommender
      </div>
      <div className="text-[11px] text-bbg-muted mb-4">
        Select your primary use case to see the best model for the job
      </div>

      {/* Use case buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            onClick={() => setSelected(uc.id === selected ? null : uc.id)}
            className={`text-[11px] px-3 py-1.5 rounded border transition-all ${
              selected === uc.id
                ? "border-bbg-green bg-bbg-green/10 text-bbg-green"
                : "border-bbg-border text-bbg-dim hover:border-bbg-mid hover:text-bbg-mid"
            }`}
          >
            {uc.label}
          </button>
        ))}
      </div>

      {/* Recommendation */}
      {useCase && topModels.length > 0 ? (
        <div>
          <div className="text-[11px] text-bbg-dim mb-3">
            {useCase.reason}
          </div>
          <div className="space-y-2">
            {topModels.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 bg-black border border-bbg-border rounded p-3"
              >
                <div
                  className="text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded"
                  style={{
                    backgroundColor: m.providerColor + "30",
                    color: m.providerColor,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="font-bold text-sm"
                  style={{ color: m.providerColor }}
                >
                  {m.name}
                </div>
                <div className="text-bbg-muted text-[11px]">{m.provider}</div>
                <div className="ml-auto flex gap-3 text-[11px]">
                  <span className="text-bbg-dim">ELO {m.arenaElo}</span>
                  <span className="text-bbg-green">
                    {m.inputPrice === 0 ? "FREE" : `$${m.inputPrice}/M in`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-bbg-muted text-[11px] text-center py-4">
          Choose a use case above to see recommendations
        </div>
      )}
    </div>
  );
}
