export type Modality = "text" | "image" | "audio" | "video" | "code";

export interface BenchmarkScore {
  name: string;
  score: number;
  maxScore: number;
  unit?: string;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  provider: string;
  providerColor: string;
  isOpenSource: boolean;
  contextWindow: number; // in thousands
  inputPrice: number; // $ per million tokens
  outputPrice: number; // $ per million tokens
  knowledgeCutoff: string;
  modalities: Modality[];
  apiUrl: string;
  releaseDate: string;
  description: string;
  bestFor: string[];
  arenaElo: number;
  tokensPerSecond: number;
  benchmarks: BenchmarkScore[];
  latestNews?: string;
  statusUrl: string;
  badge?: string;
}

export const MODELS: Model[] = [
  {
    id: "claude",
    name: "Claude",
    version: "3.7 Sonnet",
    provider: "Anthropic",
    providerColor: "#CC785C",
    isOpenSource: false,
    contextWindow: 200,
    inputPrice: 3.0,
    outputPrice: 15.0,
    knowledgeCutoff: "2024-10",
    modalities: ["text", "image", "code"],
    apiUrl: "https://api.anthropic.com",
    releaseDate: "2025-02-24",
    description:
      "Anthropic's flagship model built for safety and advanced reasoning. Excels at nuanced writing, complex analysis, and agentic coding tasks.",
    bestFor: ["Reasoning", "Coding", "Safety", "Writing"],
    arenaElo: 1323,
    tokensPerSecond: 85,
    badge: "TOP REASONING",
    statusUrl: "https://status.anthropic.com",
    benchmarks: [
      { name: "MMLU", score: 88.7, maxScore: 100 },
      { name: "HumanEval", score: 93.7, maxScore: 100 },
      { name: "MATH", score: 78.3, maxScore: 100 },
      { name: "GPQA", score: 59.4, maxScore: 100 },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    version: "2.5 Pro",
    provider: "Google",
    providerColor: "#4285F4",
    isOpenSource: false,
    contextWindow: 1000,
    inputPrice: 1.25,
    outputPrice: 10.0,
    knowledgeCutoff: "2025-01",
    modalities: ["text", "image", "audio", "video", "code"],
    apiUrl: "https://generativelanguage.googleapis.com",
    releaseDate: "2025-03-25",
    description:
      "Google's most capable multimodal model with a 1M token context window. Best for processing large documents, video understanding, and deep research.",
    bestFor: ["Multimodal", "Long Context", "Research", "Video"],
    arenaElo: 1380,
    tokensPerSecond: 120,
    badge: "LONGEST CONTEXT",
    statusUrl: "https://status.cloud.google.com",
    benchmarks: [
      { name: "MMLU", score: 90.0, maxScore: 100 },
      { name: "HumanEval", score: 87.0, maxScore: 100 },
      { name: "MATH", score: 91.0, maxScore: 100 },
      { name: "GPQA", score: 84.0, maxScore: 100 },
    ],
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    version: "2024-11-20",
    provider: "OpenAI",
    providerColor: "#10A37F",
    isOpenSource: false,
    contextWindow: 128,
    inputPrice: 2.5,
    outputPrice: 10.0,
    knowledgeCutoff: "2024-04",
    modalities: ["text", "image", "audio", "code"],
    apiUrl: "https://api.openai.com",
    releaseDate: "2024-11-20",
    description:
      "OpenAI's omnivore flagship model. Real-time voice, vision, and broad ecosystem integrations make it the most widely deployed model globally.",
    bestFor: ["General Purpose", "Voice", "Ecosystem", "Enterprise"],
    arenaElo: 1295,
    tokensPerSecond: 110,
    badge: "MOST DEPLOYED",
    statusUrl: "https://status.openai.com",
    benchmarks: [
      { name: "MMLU", score: 88.7, maxScore: 100 },
      { name: "HumanEval", score: 90.2, maxScore: 100 },
      { name: "MATH", score: 76.6, maxScore: 100 },
      { name: "GPQA", score: 53.6, maxScore: 100 },
    ],
  },
  {
    id: "llama",
    name: "Llama",
    version: "3.3 70B",
    provider: "Meta",
    providerColor: "#0866FF",
    isOpenSource: true,
    contextWindow: 128,
    inputPrice: 0.0,
    outputPrice: 0.0,
    knowledgeCutoff: "2024-12",
    modalities: ["text", "code"],
    apiUrl: "https://together.ai",
    releaseDate: "2024-12-06",
    description:
      "Meta's open-weights powerhouse. Free to self-host, fine-tune, and deploy. The gold standard for open-source AI with near-frontier performance.",
    bestFor: ["Open Source", "Self-Hosting", "Fine-Tuning", "Privacy"],
    arenaElo: 1258,
    tokensPerSecond: 95,
    badge: "OPEN SOURCE",
    statusUrl: "https://metastatus.com",
    benchmarks: [
      { name: "MMLU", score: 86.0, maxScore: 100 },
      { name: "HumanEval", score: 88.4, maxScore: 100 },
      { name: "MATH", score: 77.0, maxScore: 100 },
      { name: "GPQA", score: 50.7, maxScore: 100 },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    version: "3",
    provider: "xAI",
    providerColor: "#FF5500",
    isOpenSource: false,
    contextWindow: 131,
    inputPrice: 3.0,
    outputPrice: 15.0,
    knowledgeCutoff: "2025-04",
    modalities: ["text", "image", "code"],
    apiUrl: "https://api.x.ai",
    releaseDate: "2025-02-17",
    description:
      "Elon Musk's model trained on real-time X (Twitter) data. Near-current knowledge cutoff, unfiltered responses, and strong math reasoning via Grok 3 Think.",
    bestFor: ["Real-Time Web", "Math", "Current Events", "Unfiltered"],
    arenaElo: 1302,
    tokensPerSecond: 75,
    badge: "REAL-TIME",
    statusUrl: "https://status.x.ai",
    benchmarks: [
      { name: "MMLU", score: 87.5, maxScore: 100 },
      { name: "HumanEval", score: 88.0, maxScore: 100 },
      { name: "MATH", score: 93.3, maxScore: 100 },
      { name: "GPQA", score: 84.6, maxScore: 100 },
    ],
  },
  {
    id: "minimax",
    name: "MiniMax",
    version: "Text-01",
    provider: "MiniMax AI",
    providerColor: "#7C3AED",
    isOpenSource: false,
    contextWindow: 1000,
    inputPrice: 0.2,
    outputPrice: 1.1,
    knowledgeCutoff: "2024-08",
    modalities: ["text", "audio", "code"],
    apiUrl: "https://api.minimax.chat",
    releaseDate: "2025-01-15",
    description:
      "Chinese frontier model with a 1M context window at a fraction of competitor pricing. Strong multilingual capabilities and cost-efficient large-scale deployments.",
    bestFor: ["Cost Efficiency", "Multilingual", "Long Context", "Scale"],
    arenaElo: 1214,
    tokensPerSecond: 100,
    badge: "BEST VALUE",
    statusUrl: "https://api.minimax.chat",
    benchmarks: [
      { name: "MMLU", score: 84.5, maxScore: 100 },
      { name: "HumanEval", score: 82.0, maxScore: 100 },
      { name: "MATH", score: 73.0, maxScore: 100 },
      { name: "GPQA", score: 45.0, maxScore: 100 },
    ],
  },
  {
    id: "kimi",
    name: "Kimi",
    version: "k1.5",
    provider: "Moonshot AI",
    providerColor: "#06B6D4",
    isOpenSource: false,
    contextWindow: 128,
    inputPrice: 0.15,
    outputPrice: 0.6,
    knowledgeCutoff: "2024-09",
    modalities: ["text", "image", "code"],
    apiUrl: "https://api.moonshot.cn",
    releaseDate: "2025-01-22",
    description:
      "Moonshot AI's reasoning-focused model with chain-of-thought capabilities. Competitive on math and coding benchmarks, popular in the Chinese AI ecosystem.",
    bestFor: ["Reasoning", "Math", "Cost", "Chinese Market"],
    arenaElo: 1220,
    tokensPerSecond: 90,
    statusUrl: "https://kimi.moonshot.cn",
    benchmarks: [
      { name: "MMLU", score: 85.1, maxScore: 100 },
      { name: "HumanEval", score: 84.6, maxScore: 100 },
      { name: "MATH", score: 77.5, maxScore: 100 },
      { name: "GPQA", score: 48.0, maxScore: 100 },
    ],
  },
];

export const USE_CASES = [
  {
    id: "coding",
    label: "Coding",
    topModels: ["claude", "gpt4o", "gemini"],
    reason: "Best code generation, debugging, and agentic dev tasks",
  },
  {
    id: "writing",
    label: "Writing",
    topModels: ["claude", "gpt4o", "grok"],
    reason: "Natural prose, nuanced tone, and long-form content",
  },
  {
    id: "research",
    label: "Research",
    topModels: ["gemini", "claude", "grok"],
    reason: "Long context, citation accuracy, real-time data",
  },
  {
    id: "multimodal",
    label: "Multimodal",
    topModels: ["gemini", "gpt4o", "claude"],
    reason: "Vision, audio, and video understanding",
  },
  {
    id: "opensource",
    label: "Open Source",
    topModels: ["llama", "minimax", "kimi"],
    reason: "Self-host, fine-tune, no API costs",
  },
  {
    id: "costefficient",
    label: "Cost Efficient",
    topModels: ["kimi", "minimax", "llama"],
    reason: "Lowest price per million tokens for production scale",
  },
];

export const BENCHMARKS_INFO = [
  { id: "MMLU", label: "MMLU", description: "General knowledge across 57 subjects" },
  { id: "HumanEval", label: "HumanEval", description: "Python code generation tasks" },
  { id: "MATH", label: "MATH", description: "Competition-level math problems" },
  { id: "GPQA", label: "GPQA", description: "Expert-level science questions" },
];
