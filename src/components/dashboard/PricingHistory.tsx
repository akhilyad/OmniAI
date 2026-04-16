"use client";

import useSWR from "swr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MODELS } from "@/data/models";
import type { ModelPricingHistory } from "@/app/api/pricing-history/route";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type PriceType = "input" | "output";

export function PricingHistory() {
  const { data, isLoading } = useSWR<{ data: ModelPricingHistory[]; source: string }>(
    "/api/pricing-history",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  );

  const [priceType, setPriceType] = useState<PriceType>("input");
  const [selectedModels, setSelectedModels] = useState<string[]>(
    MODELS.map((m) => m.id)
  );

  function toggleModel(id: string) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Build unified date-keyed dataset for recharts
  const chartData: Record<string, Record<string, number | string>> = {};

  if (data?.data) {
    for (const model of data.data) {
      if (!selectedModels.includes(model.modelId)) continue;
      for (const pt of model.history) {
        if (!chartData[pt.date]) chartData[pt.date] = { date: pt.date };
        chartData[pt.date][model.name] =
          priceType === "input" ? pt.inputPrice : pt.outputPrice;
      }
    }
  }

  const chartRows = Object.values(chartData).sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );

  const visibleModels = (data?.data ?? []).filter((m) =>
    selectedModels.includes(m.modelId)
  );

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 font-mono">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-zinc-400 uppercase tracking-wider">
          Pricing History (90 days)
        </div>
        <div className="flex items-center gap-2">
          {data?.source === "static" && (
            <span className="text-[10px] text-zinc-600 border border-zinc-700 px-1.5 py-0.5 rounded">
              STATIC · connect Neon for live tracking
            </span>
          )}
          {data?.source === "db" && (
            <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-800 px-1.5 py-0.5 rounded">
              ● LIVE DB
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-3 mb-4">
        <div className="flex gap-1">
          {(["input", "output"] as PriceType[]).map((t) => (
            <button
              key={t}
              onClick={() => setPriceType(t)}
              className={`text-[11px] px-2.5 py-1 rounded border transition-all ${
                priceType === t
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
              }`}
            >
              {t === "input" ? "INPUT PRICE" : "OUTPUT PRICE"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleModel(m.id)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                selectedModels.includes(m.id)
                  ? "border-current"
                  : "border-zinc-700 opacity-30"
              }`}
              style={
                selectedModels.includes(m.id)
                  ? { borderColor: m.providerColor, color: m.providerColor }
                  : {}
              }
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">
          Loading pricing history…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartRows}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => String(v).slice(5)} // "MM-DD"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v === 0 ? "FREE" : `$${v}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 4,
                fontFamily: "monospace",
                fontSize: 11,
              }}
              formatter={(val) => [
                Number(val) === 0 ? "FREE" : `$${Number(val).toFixed(2)}/M`,
              ]}
            />
            <Legend wrapperStyle={{ fontFamily: "monospace", fontSize: 11 }} />
            {visibleModels.map((m) => (
              <Line
                key={m.modelId}
                type="stepAfter"
                dataKey={m.name}
                stroke={m.color}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
      <div className="text-[10px] text-zinc-600 mt-2">
        $ per 1M tokens · {priceType} pricing ·{" "}
        {data?.source === "db"
          ? "Live from Neon DB — updated daily via /api/pricing-snapshot"
          : "Static data — add DATABASE_URL to .env.local to track live changes"}
      </div>
    </div>
  );
}
