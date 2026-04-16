"use client";

import { MODELS } from "@/data/models";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

export function PricingChart() {
  const data = MODELS.map((m) => ({
    name: m.name,
    input: m.inputPrice,
    output: m.outputPrice,
    color: m.providerColor,
    isFree: m.inputPrice === 0,
  }));

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 font-mono">
      <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">
        Pricing per 1M Tokens (USD)
      </div>
      <div className="text-[10px] text-zinc-600 mb-4">
        Llama is $0 when self-hosted — cloud providers vary
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={2}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: 11,
            }}
            formatter={(val: number, name: string) => [
              val === 0 ? "FREE" : `$${val}/M`,
              name === "input" ? "Input" : "Output",
            ]}
          />
          <Legend
            wrapperStyle={{ fontFamily: "monospace", fontSize: 11 }}
            formatter={(val) => (val === "input" ? "Input" : "Output")}
          />
          <Bar dataKey="input" name="input" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.9} />
            ))}
          </Bar>
          <Bar dataKey="output" name="output" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
