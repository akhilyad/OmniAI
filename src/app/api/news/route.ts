import { NextResponse } from "next/server";
import Parser from "rss-parser";

// Revalidate every 15 minutes via Next.js ISR
export const revalidate = 900;

const parser = new Parser({ timeout: 5000 });

// Free RSS feeds — no API keys required, no commercial restrictions
const FEEDS = [
  {
    url: "https://openai.com/blog/rss.xml",
    modelTag: "gpt4o",
    source: "OpenAI Blog",
  },
  {
    url: "https://www.anthropic.com/rss.xml",
    modelTag: "claude",
    source: "Anthropic Blog",
  },
  {
    url: "https://blog.google/technology/ai/rss/",
    modelTag: "gemini",
    source: "Google AI Blog",
  },
  {
    url: "https://huggingface.co/blog/feed.xml",
    modelTag: "llama",
    source: "HuggingFace Blog",
  },
  {
    url: "https://x.ai/news/rss.xml",
    modelTag: "grok",
    source: "xAI News",
  },
  {
    url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    modelTag: null, // general AI news — tagged by keyword matching below
    source: "The Verge AI",
  },
  {
    url: "https://arstechnica.com/ai/feed/",
    modelTag: null,
    source: "Ars Technica AI",
  },
];

const MODEL_KEYWORDS: Record<string, string[]> = {
  claude:   ["claude", "anthropic"],
  gemini:   ["gemini", "google deepmind", "google ai"],
  gpt4o:    ["openai", "gpt-4", "gpt4", "chatgpt", "o3", "o4"],
  llama:    ["llama", "meta ai", "meta's ai"],
  grok:     ["grok", "xai", "x.ai"],
  deepseek: ["deepseek"],
  qwen:     ["qwen", "alibaba", "aliyun"],
  mistral:  ["mistral"],
  nemotron: ["nemotron", "nvidia nim"],
  cohere:   ["cohere", "command r"],
  jamba:    ["jamba", "ai21"],
  glm4:     ["glm-4", "zhipu", "bigmodel"],
  doubao:   ["doubao", "bytedance", "skylark"],
  ernie:    ["ernie", "baidu", "wenxin"],
  minimax:  ["minimax"],
  kimi:     ["kimi", "moonshot"],
};

function detectModelTag(title: string, content: string): string | null {
  const text = (title + " " + content).toLowerCase();
  for (const [model, keywords] of Object.entries(MODEL_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return model;
  }
  return null;
}

export interface NewsItem {
  date: string;
  model: string | null;
  headline: string;
  source: string;
  link?: string;
}

export async function GET() {
  const results: NewsItem[] = [];

  await Promise.allSettled(
    FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        for (const item of (parsed.items ?? []).slice(0, 5)) {
          const headline = item.title ?? "";
          const content = item.contentSnippet ?? item.content ?? "";
          const modelTag =
            feed.modelTag ?? detectModelTag(headline, content);
          results.push({
            date: item.pubDate
              ? new Date(item.pubDate).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10),
            model: modelTag,
            headline: headline.slice(0, 140),
            source: feed.source,
            link: item.link,
          });
        }
      } catch {
        // Feed failed — silently skip; caller falls back to static data
      }
    })
  );

  // Sort newest first, then deduplicate by exact headline
  results.sort((a, b) => b.date.localeCompare(a.date));

  const seen = new Set<string>();
  const deduped = results.filter((item) => {
    if (seen.has(item.headline)) return false;
    seen.add(item.headline);
    return true;
  });

  return NextResponse.json({ items: deduped.slice(0, 30), fetchedAt: new Date().toISOString() });
}
