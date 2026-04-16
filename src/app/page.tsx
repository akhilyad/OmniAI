"use client";

import { useState, useMemo } from "react";
import { MODELS, PROVIDERS } from "@/data/models";
import { Ticker } from "@/components/dashboard/Ticker";
import { ModelCard } from "@/components/dashboard/ModelCard";
import { BenchmarkChart } from "@/components/dashboard/BenchmarkChart";
import { ComparisonTable } from "@/components/dashboard/ComparisonTable";
import { LeaderBoard } from "@/components/dashboard/LeaderBoard";
import { UseCaseRecommender } from "@/components/dashboard/UseCaseRecommender";
import { PricingChart } from "@/components/dashboard/PricingChart";
import { PricingHistory } from "@/components/dashboard/PricingHistory";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LiveClock } from "@/components/dashboard/LiveClock";

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"elo" | "inputPrice" | "speed" | "context">("elo");
  const [search, setSearch] = useState("");

  function toggleModel(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const visibleModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = MODELS.filter((m) => {
      if (activeProvider && m.provider !== activeProvider) return false;
      if (q && !m.name.toLowerCase().includes(q) && !m.provider.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "elo")        return b.arenaElo - a.arenaElo;
      if (sortBy === "inputPrice") return a.inputPrice - b.inputPrice;
      if (sortBy === "speed")      return b.tokensPerSecond - a.tokensPerSecond;
      if (sortBy === "context")    return b.contextWindow - a.contextWindow;
      return 0;
    });
    return list;
  }, [activeProvider, sortBy, search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top nav / header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 font-mono">
            <div className="text-yellow-400 font-black text-lg tracking-tight">
              OmniAI
            </div>
            <div className="text-zinc-600 text-xs">|</div>
            <div className="text-zinc-400 text-xs uppercase tracking-wider">
              AI Model Terminal
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400">LIVE</span>
            </div>
            <LiveClock />
            <span className="text-zinc-600">
              {MODELS.length} MODELS · {PROVIDERS.length} PROVIDERS
            </span>
            <span className="text-zinc-600">
              {selectedIds.length > 0
                ? `${selectedIds.length} SELECTED`
                : "CLICK CARDS TO COMPARE"}
            </span>
          </div>
        </div>
      </header>

      {/* Live ticker */}
      <Ticker />

      {/* Main content */}
      <main className="px-6 py-6 space-y-6 max-w-[1800px] mx-auto">
        {/* Provider filter bar */}
        <section>
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1">
              Filter:
            </span>
            <button
              onClick={() => setActiveProvider(null)}
              className={`text-[11px] px-2.5 py-1 rounded border transition-all ${
                activeProvider === null
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
              }`}
            >
              ALL ({MODELS.length})
            </button>
            {PROVIDERS.map((provider) => {
              const providerModels = MODELS.filter((m) => m.provider === provider);
              const color = providerModels[0]?.providerColor ?? "#71717a";
              const isActive = activeProvider === provider;
              return (
                <button
                  key={provider}
                  onClick={() =>
                    setActiveProvider(isActive ? null : provider)
                  }
                  className={`text-[11px] px-2.5 py-1 rounded border transition-all ${
                    isActive
                      ? "font-bold"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: color,
                          backgroundColor: color + "18",
                          color,
                        }
                      : undefined
                  }
                >
                  {provider}
                </button>
              );
            })}
            {activeProvider && (
              <button
                onClick={() => setActiveProvider(null)}
                className="text-[11px] text-zinc-600 hover:text-zinc-400 ml-1 underline"
              >
                clear
              </button>
            )}
          </div>
        </section>

        {/* Sort + search bar */}
        <section>
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1">
              Sort:
            </span>
            {(
              [
                { id: "elo",        label: "ELO ▼" },
                { id: "inputPrice", label: "PRICE ▲" },
                { id: "speed",      label: "SPEED ▼" },
                { id: "context",    label: "CTX ▼" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSortBy(id)}
                className={`text-[11px] px-2.5 py-1 rounded border transition-all ${
                  sortBy === id
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search model or provider…"
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1 text-[11px] font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 w-52"
              />
            </div>
          </div>
        </section>

        {/* Model grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              {activeProvider
                ? `${activeProvider} — ${visibleModels.length} model${visibleModels.length !== 1 ? "s" : ""}`
                : `Model Overview — ${MODELS.length} Models · Click to Select for Comparison`}
            </h2>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300 underline"
              >
                Clear selection ({selectedIds.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-3">
            {visibleModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedIds.includes(model.id)}
                onSelect={toggleModel}
              />
            ))}
          </div>
        </section>

        {/* Tabs for main analytics */}
        <Tabs defaultValue="compare" className="font-mono">
          <TabsList className="bg-zinc-900 border border-zinc-700 h-auto p-1 flex-wrap">
            {[
              { val: "compare", label: "COMPARISON MATRIX" },
              { val: "benchmarks", label: "BENCHMARKS" },
              { val: "pricing", label: "PRICING TODAY" },
              { val: "pricing-history", label: "PRICE HISTORY" },
              { val: "leaderboard", label: "LEADERBOARD" },
              { val: "usecase", label: "USE CASES" },
              { val: "news", label: "NEWS FEED" },
            ].map(({ val, label }) => (
              <TabsTrigger
                key={val}
                value={val}
                className="text-[11px] data-[state=active]:bg-yellow-400 data-[state=active]:text-black px-3 py-1.5"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="compare" className="mt-4">
            <ComparisonTable selectedIds={selectedIds} />
          </TabsContent>

          <TabsContent value="benchmarks" className="mt-4">
            <BenchmarkChart selectedIds={selectedIds.length ? selectedIds : MODELS.map((m) => m.id)} />
          </TabsContent>

          <TabsContent value="pricing" className="mt-4">
            <PricingChart />
          </TabsContent>

          <TabsContent value="pricing-history" className="mt-4">
            <PricingHistory />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <LeaderBoard />
          </TabsContent>

          <TabsContent value="usecase" className="mt-4">
            <UseCaseRecommender />
          </TabsContent>

          <TabsContent value="news" className="mt-4">
            <NewsFeed />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="border-t border-zinc-800 pt-4 pb-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-zinc-600">
            <span>OmniAI — AI Model Terminal · {MODELS.length} models across {PROVIDERS.length} providers</span>
            <span>Data: LMSYS Arena · HuggingFace · Provider docs · Updated Apr 2025</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
