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
    <div className="min-h-screen bg-black text-zinc-100">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-bbg-border bg-black">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 gap-2">
          {/* Logo row — on mobile, dev credit sits at the far right of this row */}
          <div className="flex items-center justify-between sm:justify-start gap-3 font-mono">
            <div className="flex items-center gap-3">
              <div className="text-bbg-green font-black text-lg tracking-tight" style={{ textShadow: "0 0 12px #00FF6688" }}>
                OmniAI
              </div>
              <div className="text-bbg-muted text-xs">|</div>
              <div className="text-bbg-dim text-xs uppercase tracking-wider">
                AI Model Terminal
              </div>
            </div>
            {/* Visible only on portrait mobile */}
            <span className="sm:hidden text-bbg-dim text-xs">
              dev: <a href="https://www.instagram.com/capt.night_watch" target="_blank" rel="noopener noreferrer" className="text-bbg-green hover:underline">CaptNightWatch</a>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bbg-green animate-pulse" />
              <span className="text-bbg-green">LIVE</span>
            </div>
            <LiveClock />
            <span className="text-bbg-muted hidden sm:inline">
              {MODELS.length} MODELS · {PROVIDERS.length} PROVIDERS
            </span>
            <span className="text-bbg-muted">
              {selectedIds.length > 0
                ? `${selectedIds.length} SELECTED`
                : <span className="hidden xs:inline">CLICK CARDS TO COMPARE</span>}
            </span>
            {/* Visible on landscape/desktop */}
            <span className="hidden sm:inline text-bbg-dim border-l border-bbg-border pl-3">
              dev: <a href="https://www.instagram.com/capt.night_watch" target="_blank" rel="noopener noreferrer" className="text-bbg-green hover:underline">CaptNightWatch</a>
            </span>
          </div>
        </div>
      </header>

      {/* ── Live ticker ─────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 max-w-[1800px] mx-auto">

        {/* Provider filter bar */}
        <section>
          <div className="flex items-center gap-1.5 flex-wrap font-mono">
            <span className="text-[10px] text-bbg-muted uppercase tracking-wider mr-1">Filter:</span>
            <button
              onClick={() => setActiveProvider(null)}
              className={`text-[11px] px-2.5 py-1 rounded border transition-all ${
                activeProvider === null
                  ? "border-bbg-green bg-bbg-green/10 text-bbg-green"
                  : "border-bbg-border text-bbg-dim hover:border-bbg-mid hover:text-bbg-mid"
              }`}
            >
              ALL ({MODELS.length})
            </button>
            {PROVIDERS.map((provider) => {
              const color = MODELS.find((m) => m.provider === provider)?.providerColor ?? "#33994D";
              const isActive = activeProvider === provider;
              return (
                <button
                  key={provider}
                  onClick={() => setActiveProvider(isActive ? null : provider)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-all font-mono ${
                    isActive ? "font-bold" : "border-bbg-border text-bbg-dim hover:border-bbg-mid hover:text-bbg-mid"
                  }`}
                  style={isActive ? { borderColor: color, backgroundColor: color + "18", color } : undefined}
                >
                  {provider}
                </button>
              );
            })}
            {activeProvider && (
              <button
                onClick={() => setActiveProvider(null)}
                className="text-[11px] text-bbg-muted hover:text-bbg-dim ml-1 underline"
              >
                clear
              </button>
            )}
          </div>
        </section>

        {/* Sort + search bar */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-bbg-muted uppercase tracking-wider mr-1">Sort:</span>
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
                      ? "border-bbg-green bg-bbg-green/10 text-bbg-green"
                      : "border-bbg-border text-bbg-dim hover:border-bbg-mid hover:text-bbg-mid"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search model or provider…"
              className="bg-bbg-surface border border-bbg-border rounded px-3 py-1 text-[11px] font-mono text-zinc-300 placeholder-bbg-muted focus:outline-none focus:border-bbg-green w-full sm:w-52 sm:ml-auto transition-colors"
            />
          </div>
        </section>

        {/* Model grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-xs text-bbg-dim uppercase tracking-wider">
              {activeProvider
                ? `${activeProvider} — ${visibleModels.length} model${visibleModels.length !== 1 ? "s" : ""}`
                : `Model Overview — ${MODELS.length} Models · Click to Select for Comparison`}
            </h2>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="font-mono text-[11px] text-bbg-muted hover:text-bbg-green underline transition-colors"
              >
                Clear selection ({selectedIds.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-2 sm:gap-3">
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

        {/* ── Analytics tabs ─────────────────────────────────────────────────── */}
        {/*
          base-ui Tabs uses `data-active` (not Radix's `data-[state=active]`).
          Tailwind selector: data-[active]:...
        */}
        <Tabs defaultValue="compare" className="font-mono">
          <TabsList className="bg-black border border-bbg-border h-auto p-1 flex-nowrap gap-0.5 overflow-x-auto w-full scrollbar-none">
            {[
              { val: "compare",         label: "COMPARISON MATRIX" },
              { val: "benchmarks",      label: "BENCHMARKS" },
              { val: "pricing",         label: "PRICING TODAY" },
              { val: "pricing-history", label: "PRICE HISTORY" },
              { val: "leaderboard",     label: "LEADERBOARD" },
              { val: "usecase",         label: "USE CASES" },
              { val: "news",            label: "NEWS FEED" },
            ].map(({ val, label }) => (
              <TabsTrigger
                key={val}
                value={val}
                className="
                  text-[11px] px-3 py-1.5 rounded transition-all
                  text-bbg-dim hover:text-bbg-mid
                  data-[active]:bg-bbg-green data-[active]:text-black data-[active]:font-bold
                  data-[active]:shadow-[0_0_8px_#00FF6644]
                "
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
        <footer className="border-t border-bbg-border pt-4 pb-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-bbg-muted">
            <span>OmniAI — AI Model Terminal · {MODELS.length} models across {PROVIDERS.length} providers</span>
            <span>Data: LMSYS Arena · HuggingFace · Provider docs · Updated Apr 2025</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
