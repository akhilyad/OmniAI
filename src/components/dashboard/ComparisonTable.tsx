"use client";

import { MODELS } from "@/data/models";
import { formatContextWindow, formatPrice } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComparisonTableProps {
  selectedIds: string[];
}

export function ComparisonTable({ selectedIds }: ComparisonTableProps) {
  const models = selectedIds.length
    ? MODELS.filter((m) => selectedIds.includes(m.id))
    : MODELS;

  const rows = [
    { label: "Provider", key: (m: typeof MODELS[0]) => m.provider },
    { label: "Version", key: (m: typeof MODELS[0]) => m.version },
    { label: "Context Window", key: (m: typeof MODELS[0]) => formatContextWindow(m.contextWindow) },
    { label: "Input Price", key: (m: typeof MODELS[0]) => formatPrice(m.inputPrice) + "/M" },
    { label: "Output Price", key: (m: typeof MODELS[0]) => formatPrice(m.outputPrice) + "/M" },
    { label: "Arena ELO", key: (m: typeof MODELS[0]) => String(m.arenaElo) },
    { label: "Speed (tok/s)", key: (m: typeof MODELS[0]) => String(m.tokensPerSecond) },
    { label: "Knowledge Cutoff", key: (m: typeof MODELS[0]) => m.knowledgeCutoff },
    { label: "Open Source", key: (m: typeof MODELS[0]) => (m.isOpenSource ? "✓ YES" : "✗ NO") },
    {
      label: "Modalities",
      key: (m: typeof MODELS[0]) => m.modalities.join(", "),
    },
    { label: "MMLU", key: (m: typeof MODELS[0]) => String(m.benchmarks.find((b) => b.name === "MMLU")?.score ?? "—") + "%" },
    { label: "HumanEval", key: (m: typeof MODELS[0]) => String(m.benchmarks.find((b) => b.name === "HumanEval")?.score ?? "—") + "%" },
    { label: "MATH", key: (m: typeof MODELS[0]) => String(m.benchmarks.find((b) => b.name === "MATH")?.score ?? "—") + "%" },
    { label: "GPQA", key: (m: typeof MODELS[0]) => String(m.benchmarks.find((b) => b.name === "GPQA")?.score ?? "—") + "%" },
  ];

  function getBest(rowKey: (m: typeof MODELS[0]) => string, models: typeof MODELS) {
    const numericVals = models.map((m) => parseFloat(rowKey(m)));
    if (numericVals.every(isNaN)) return null;
    const max = Math.max(...numericVals.filter((v) => !isNaN(v)));
    return max;
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded overflow-auto font-mono">
      <div className="text-xs text-zinc-400 p-4 pb-2 uppercase tracking-wider">
        Full Comparison Matrix
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-transparent">
            <TableHead className="text-zinc-500 text-[11px] w-32">METRIC</TableHead>
            {models.map((m) => (
              <TableHead key={m.id} className="text-[11px]">
                <span style={{ color: m.providerColor }} className="font-bold">
                  {m.name}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const bestVal = getBest(row.key, models);
            return (
              <TableRow key={row.label} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="text-zinc-500 text-[11px] font-mono py-2">
                  {row.label}
                </TableCell>
                {models.map((m) => {
                  const val = row.key(m);
                  const numericVal = parseFloat(val);
                  const isBest = bestVal !== null && !isNaN(numericVal) && numericVal === bestVal;
                  return (
                    <TableCell
                      key={m.id}
                      className={`text-[11px] py-2 font-mono ${
                        isBest ? "text-yellow-400 font-bold" : "text-zinc-300"
                      } ${val === "✓ YES" ? "text-green-400" : ""} ${
                        val === "✗ NO" ? "text-zinc-600" : ""
                      }`}
                    >
                      {val}
                      {isBest && (
                        <span className="text-yellow-400 ml-1 text-[9px]">▲</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
