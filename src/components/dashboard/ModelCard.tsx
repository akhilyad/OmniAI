"use client";

import { Model } from "@/data/models";
import { formatContextWindow, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, Brain, DollarSign } from "lucide-react";

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const MODALITY_ICONS: Record<string, string> = {
  text: "T",
  image: "I",
  audio: "A",
  video: "V",
  code: "</>",
};

export function ModelCard({ model, isSelected, onSelect }: ModelCardProps) {
  return (
    <div
      onClick={() => onSelect(model.id)}
      className={`
        relative cursor-pointer rounded border p-4 transition-all duration-150 select-none
        font-mono text-sm
        ${isSelected
          ? "border-yellow-400 bg-zinc-800 shadow-lg shadow-yellow-400/10"
          : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
        }
      `}
    >
      {/* Provider color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t"
        style={{ backgroundColor: model.providerColor }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-base">{model.name}</span>
            {model.isOpenSource && (
              <Badge variant="outline" className="text-[10px] border-green-600 text-green-400 px-1 py-0">
                OSS
              </Badge>
            )}
          </div>
          <div className="text-zinc-400 text-[11px] mt-0.5">
            {model.provider} · v{model.version}
          </div>
        </div>
        {model.badge && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: model.providerColor + "30", color: model.providerColor }}
          >
            {model.badge}
          </span>
        )}
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-zinc-800/60 rounded p-2 text-center">
          <div className="text-yellow-400 font-bold text-sm">
            {formatPrice(model.inputPrice)}
          </div>
          <div className="text-zinc-500 text-[10px]">INPUT/M</div>
        </div>
        <div className="bg-zinc-800/60 rounded p-2 text-center">
          <div className="text-orange-400 font-bold text-sm">
            {formatContextWindow(model.contextWindow)}
          </div>
          <div className="text-zinc-500 text-[10px]">CONTEXT</div>
        </div>
        <div className="bg-zinc-800/60 rounded p-2 text-center">
          <div className="text-blue-400 font-bold text-sm">
            {model.arenaElo}
          </div>
          <div className="text-zinc-500 text-[10px]">ELO</div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-3 mb-3 text-[11px]">
        <span className="flex items-center gap-1 text-zinc-400">
          <Zap size={10} className="text-yellow-400" />
          {model.tokensPerSecond} tok/s
        </span>
        <span className="flex items-center gap-1 text-zinc-400">
          <Brain size={10} className="text-purple-400" />
          {model.knowledgeCutoff}
        </span>
        <span className="flex items-center gap-1 text-zinc-400">
          <DollarSign size={10} className="text-green-400" />
          {formatPrice(model.outputPrice)}/M out
        </span>
      </div>

      {/* Modalities */}
      <div className="flex gap-1 mb-3">
        {model.modalities.map((m) => (
          <span
            key={m}
            className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded"
          >
            {MODALITY_ICONS[m] ?? m}
          </span>
        ))}
      </div>

      {/* Best for */}
      <div className="flex flex-wrap gap-1">
        {model.bestFor.map((tag) => (
          <span
            key={tag}
            className="text-[10px] rounded px-1.5 py-0.5"
            style={{
              backgroundColor: model.providerColor + "20",
              color: model.providerColor,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-zinc-700 text-yellow-400 text-[11px] text-center">
          ▶ SELECTED FOR COMPARISON
        </div>
      )}
    </div>
  );
}
