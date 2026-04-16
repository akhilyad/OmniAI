"use client";

import { MODELS, BENCHMARKS_INFO, Model } from "@/data/models";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface BenchmarkChartProps {
  selectedIds: string[];
}

export function BenchmarkChart({ selectedIds }: BenchmarkChartProps) {
  const selected = MODELS.filter((m) => selectedIds.includes(m.id));

  const data = BENCHMARKS_INFO.map((bench) => {
    const entry: Record<string, string | number> = { benchmark: bench.label };
    selected.forEach((m) => {
      const score = m.benchmarks.find((b) => b.name === bench.id);
      entry[m.name] = score?.score ?? 0;
    });
    return entry;
  });

  const colors = selected.map((m) => m.providerColor);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 font-mono">
      <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">Benchmark Radar</div>
      <div className="text-[10px] text-zinc-600 mb-4">
        {BENCHMARKS_INFO.map((b) => `${b.label}: ${b.description}`).join("  ·  ")}
      </div>

      {selected.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">
          Select models above to compare benchmarks
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="#3f3f46" />
            <PolarAngleAxis
              dataKey="benchmark"
              tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 4,
                fontFamily: "monospace",
                fontSize: 12,
              }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "monospace", fontSize: 11 }}
            />
            {selected.map((model, i) => (
              <Radar
                key={model.id}
                name={model.name}
                dataKey={model.name}
                stroke={colors[i]}
                fill={colors[i]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
