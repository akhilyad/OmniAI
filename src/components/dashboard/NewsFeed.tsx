"use client";

import useSWR from "swr";
import { MODELS } from "@/data/models";
import type { NewsItem } from "@/app/api/news/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Static seed — shown immediately while live data loads or if feeds fail
const STATIC_NEWS: NewsItem[] = [
  { date: "2025-04-14", model: "gemini", headline: "Google Gemini 2.5 Pro achieves #1 on LMSYS Chatbot Arena", source: "Google Blog" },
  { date: "2025-04-12", model: "claude", headline: "Anthropic launches Claude 3.7 Sonnet with extended thinking mode", source: "Anthropic Blog" },
  { date: "2025-04-10", model: "grok", headline: "xAI cuts Grok 3 API pricing by 40% for early adopters", source: "xAI" },
  { date: "2025-04-08", model: "llama", headline: "Meta Llama 4 Scout achieves 10M token context window", source: "Meta AI Blog" },
  { date: "2025-04-05", model: "minimax", headline: "MiniMax Text-01 now supports real-time voice synthesis API", source: "MiniMax AI" },
  { date: "2025-04-03", model: "kimi", headline: "Moonshot Kimi k1.5 tops Chinese domestic benchmark rankings", source: "Moonshot AI" },
  { date: "2025-04-01", model: "gpt4o", headline: "OpenAI releases GPT-4.5 with expanded tool use capabilities", source: "OpenAI Blog" },
];

export function NewsFeed() {
  const { data, isLoading } = useSWR<{ items: NewsItem[]; fetchedAt: string }>(
    "/api/news",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 900_000, // 15 min
      fallbackData: { items: STATIC_NEWS, fetchedAt: "" },
    }
  );

  const items = data?.items?.length ? data.items : STATIC_NEWS;
  const isLive = Boolean(data?.fetchedAt);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-zinc-400 uppercase tracking-wider">
          Latest AI News
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-[10px] text-zinc-600">fetching feeds…</span>
          )}
          <span
            className={`text-[10px] border px-2 py-0.5 rounded ${
              isLive
                ? "bg-green-900/40 text-green-400 border-green-800"
                : "bg-zinc-800 text-zinc-500 border-zinc-700"
            }`}
          >
            {isLive ? "● LIVE RSS" : "● STATIC"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const model = MODELS.find((m) => m.id === item.model);
          return (
            <div
              key={i}
              className="flex gap-3 pb-3 border-b border-zinc-800 last:border-0"
            >
              <div className="text-[10px] text-zinc-600 w-20 shrink-0 pt-0.5">
                {item.date}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {model && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        backgroundColor: model.providerColor + "25",
                        color: model.providerColor,
                      }}
                    >
                      {model.name}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {item.source}
                  </span>
                </div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-zinc-300 leading-snug hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-zinc-400 break-words"
                  >
                    {item.headline}
                  </a>
                ) : (
                  <p className="text-[11px] text-zinc-300 leading-snug break-words">
                    {item.headline}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isLive && data?.fetchedAt && (
        <div className="text-[10px] text-zinc-600 mt-4">
          Last fetched: {new Date(data.fetchedAt).toLocaleTimeString()} · Refreshes every 15 min
        </div>
      )}
    </div>
  );
}
