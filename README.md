<div align="center">

```
 ██████╗ ███╗   ███╗███╗   ██╗██╗ █████╗ ██╗
██╔═══██╗████╗ ████║████╗  ██║██║██╔══██╗██║
██║   ██║██╔████╔██║██╔██╗ ██║██║███████║██║
██║   ██║██║╚██╔╝██║██║╚██╗██║██║██╔══██║██║
╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║██║  ██║██║
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝
```

### *The Bloomberg Terminal for AI Nerds*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech)

<br/>

> **"Which LLM should I use?"**  ·  *Every developer, every week, forever.*
>
> OmniAI ends the tab hoarding. One terminal. All the data. Zero cope.

</div>

---

<div align="center">

```
╔══════════════════════════════════════════════════════════════════╗
║  LIVE LEADERBOARD  ·  PRICE TRACKER  ·  BENCHMARK CHARTS        ║
║  NEWS FEED  ·  USE CASE RECOMMENDER  ·  PRICING HISTORY          ║
╚══════════════════════════════════════════════════════════════════╝
```

</div>

---

## `> FEATURES.exe`

<table>
<tr>
<td width="50%">

### 🏆 Model Leaderboard
Live rankings across MMLU, HumanEval, MATH, and more. Know who's winning before your PM asks.

### 💰 Pricing Tracker
Token costs from OpenAI · Anthropic · Google · Meta · Mistral — all in one table. Stop doing mental math at 2am.

### 📈 Pricing History
Time-series charts backed by Neon Postgres. Watch prices drop in real time as the AI arms race bankrupts everyone.

</td>
<td width="50%">

### 📰 AI News Feed
Auto-refreshed RSS aggregator from the hottest AI sources. Stay in the loop without doom-scrolling Twitter.

### 🧠 Use Case Recommender
Tell it what you're building → get the best model for the job. Like `npm install brain`.

### 📊 Benchmark Charts
Visual radar and bar breakdowns. Ideal for flexing in stand-ups or winning arguments on Discord.

</td>
</tr>
</table>

---

## `> STACK.json`

```json
{
  "frontend":  ["Next.js 16", "React 19", "TypeScript 5", "Tailwind CSS 4"],
  "charts":    ["Recharts 3", "SWR 2"],
  "database":  ["Neon Serverless Postgres", "@neondatabase/serverless"],
  "deploy":    ["Cloudflare Pages", "@cloudflare/next-on-pages"],
  "ui":        ["shadcn/ui", "Lucide React", "class-variance-authority"]
}
```

---

## `> QUICKSTART.sh`

```bash
# ─── clone ────────────────────────────────────────────────────────
git clone https://github.com/akhilyad/AllAboutAI.git && cd AllAboutAI

# ─── install ──────────────────────────────────────────────────────
npm install

# ─── secrets ──────────────────────────────────────────────────────
cp .env.example .env.local
# Fill in DATABASE_URL and CRON_SECRET — see below

# ─── database ─────────────────────────────────────────────────────
# Run db/schema.sql in your Neon SQL editor

# ─── launch ───────────────────────────────────────────────────────
npm run dev
#    ↳ http://localhost:3000  🟢
```

---

## `> DATABASE.md`

OmniAI snapshots LLM pricing over time using **[Neon](https://neon.tech)** — free serverless Postgres that doesn't go to sleep mid-query like Supabase free tier.

```
neon.tech → Create project → Copy connection string
         → Paste into .env.local as DATABASE_URL
         → Run db/schema.sql in Neon SQL editor
         → POST /api/pricing-snapshot  ← first seed
```

---

## `> DEPLOY.sh`

```bash
# ─── build for Cloudflare ─────────────────────────────────────────
npm run build:cf

# ─── ship it ──────────────────────────────────────────────────────
npx wrangler pages deploy .vercel/output/static --project-name omni-ai
```

**Or the lazy way** — connect your GitHub repo in the Cloudflare Dashboard:

| Setting | Value |
|---|---|
| Build command | `npm run build:cf` |
| Output directory | `.vercel/output/static` |
| Node.js version | `20` |

> Set `DATABASE_URL` and `CRON_SECRET` as **encrypted secrets** in the CF Pages dashboard.
> Do **NOT** put them in `wrangler.toml`. We're not animals.

---

## `> ENV.config`

```bash
# Copy .env.example → .env.local  (already gitignored, don't be a hero)

DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
CRON_SECRET=some-long-random-string-openssl-rand-hex-32
```

---

## `> STRUCTURE.tree`

```
AllAboutAI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── leaderboard/        ← model rankings
│   │   │   ├── news/               ← rss aggregator
│   │   │   ├── pricing-history/    ← time-series data
│   │   │   └── pricing-snapshot/   ← cron price capture
│   │   └── page.tsx                ← the whole vibe
│   ├── components/dashboard/
│   │   ├── BenchmarkChart.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── LeaderBoard.tsx
│   │   ├── ModelCard.tsx
│   │   ├── NewsFeed.tsx
│   │   ├── PricingChart.tsx
│   │   ├── PricingHistory.tsx
│   │   ├── Ticker.tsx
│   │   └── UseCaseRecommender.tsx
│   ├── data/models.ts              ← model definitions
│   └── lib/
│       ├── db.ts                   ← neon client
│       └── utils.ts
└── db/schema.sql                   ← run this first
```

---

## `> LICENSE`

```
MIT. Take it. Use it. Ship it.
Just don't tell your investors you built it yourself.
```

---

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│  built at 3am · fueled by cold brew · no regrets        │
│  because navigating 12 AI pricing pages is a war crime  │
└─────────────────────────────────────────────────────────┘
```

**[⭐ Star it if it saved you from the pricing page rabbit hole](https://github.com/akhilyad/AllAboutAI)**

</div>
