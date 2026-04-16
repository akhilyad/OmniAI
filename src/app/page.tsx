"use client";

import { useState } from "react";
import { MODELS } from "@/data/models";
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

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleModel(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top nav / header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 font-mono">
            <div className="text-yellow-400 font-black text-lg tracking-tight">
              BLOOMBR
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
            <span className="text-zinc-500">{timeStr}</span>
            <span className="text-zinc-600">
              {MODELS.length} MODELS TRACKED
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
      <main className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Model grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Model Overview — Click to Select for Comparison
            </h2>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300 underline"
              >
                Clear selection
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3">
            {MODELS.map((model) => (
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
          <TabsList className="bg-zinc-900 border border-zinc-700 h-auto p-1">
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
            <span>BLOOMBR — AI Model Terminal · Built for competitive intelligence</span>
            <span>Data: LMSYS Arena · HuggingFace · Provider docs · Updated Apr 2025</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
