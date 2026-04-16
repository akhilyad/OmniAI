"use client";

import { MODELS } from "@/data/models";
import { formatPrice } from "@/lib/utils";

export function Ticker() {
  const items = MODELS.map(
    (m) =>
      `${m.provider.toUpperCase()} ${m.name} ${m.version}  |  IN: ${formatPrice(m.inputPrice)}/M  OUT: ${formatPrice(m.outputPrice)}/M  |  ELO: ${m.arenaElo}`
  );

  const ticker = [...items, ...items].join("     ◆     ");

  return (
    <div className="bg-yellow-400 text-black text-xs font-mono overflow-hidden whitespace-nowrap py-1.5">
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: "60s" }}
      >
        {ticker}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
}
