# ⚡ OmniAI

> *Because choosing the right AI model shouldn't feel like reading the Necronomicon.*

A real-time AI model intelligence dashboard — compare pricing, benchmark scores, and news across every major LLM, all in one terminal-aesthetic interface. Built for the nerds who want to know if GPT-5 finally beats Claude at math before anyone else does.

---

## 🔥 What It Does

| Feature | Details |
|---|---|
| **Model Leaderboard** | Live rankings by benchmark score — MMLU, HumanEval, MATH, and more |
| **Pricing Tracker** | Input/output token costs across OpenAI, Anthropic, Google, Meta, Mistral & friends |
| **Pricing History** | Time-series charts powered by a Neon Postgres snapshot cron |
| **AI News Feed** | Aggregated RSS from the hottest AI blogs, auto-refreshed |
| **Use Case Recommender** | Tell it what you're building, get the best model for the job |
| **Benchmark Charts** | Visual radar/bar breakdowns so you can flex at your next stand-up |

---

## 🛠 Tech Stack

```
Next.js 16  ·  React 19  ·  TypeScript  ·  Tailwind CSS 4
Recharts  ·  SWR  ·  Neon Serverless Postgres
Cloudflare Pages  ·  shadcn/ui
```

---

## 🚀 Run Locally

```bash
# 1. Clone it
git clone https://github.com/akhilyad/AllAboutAI.git
cd AllAboutAI

# 2. Install deps
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in DATABASE_URL and CRON_SECRET in .env.local

# 4. Set up the database
# Run db/schema.sql in your Neon SQL editor

# 5. Light it up
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and watch the matrix rain.

---

## 🗄 Database Setup

OmniAI uses [Neon](https://neon.tech) — free serverless Postgres that doesn't hibernate.

1. Sign up at neon.tech (free tier is plenty)
2. Create a new project
3. Paste your connection string into `.env.local` as `DATABASE_URL`
4. Run `db/schema.sql` in the Neon SQL editor to create tables
5. Hit `POST /api/pricing-snapshot` to seed your first data point

---

## ☁ Deploy to Cloudflare Pages

```bash
# Build for Cloudflare
npm run build:cf

# Deploy
npx wrangler pages deploy .vercel/output/static --project-name omni-ai
```

Or connect your GitHub repo in the Cloudflare Dashboard:
- **Build command:** `npm run build:cf`
- **Output directory:** `.vercel/output/static`
- **Node version:** 20

Set `DATABASE_URL` and `CRON_SECRET` as **encrypted secrets** in the CF Pages dashboard — not in `wrangler.toml`.

---

## 🔐 Environment Variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `CRON_SECRET` | Random secret to protect the snapshot endpoint |

> **Never commit `.env.local`** — it's already in `.gitignore`.

---

## 🗺 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── leaderboard/      # Model rankings API
│   │   ├── news/             # RSS news aggregator
│   │   ├── pricing-history/  # Historical price data
│   │   └── pricing-snapshot/ # Cron-triggered price capture
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main dashboard
├── components/
│   └── dashboard/
│       ├── BenchmarkChart.tsx
│       ├── ComparisonTable.tsx
│       ├── LeaderBoard.tsx
│       ├── ModelCard.tsx
│       ├── NewsFeed.tsx
│       ├── PricingChart.tsx
│       ├── PricingHistory.tsx
│       ├── Ticker.tsx
│       └── UseCaseRecommender.tsx
├── data/
│   └── models.ts             # Model definitions & static data
└── lib/
    ├── db.ts                 # Neon DB client
    └── utils.ts
db/
└── schema.sql                # Database schema
```

---

## 📸 Screenshot

> *Terminal green. Recharts. The vibe: Bloomberg Terminal if it respected your intelligence.*

---

## 📄 License

MIT — do what you want, just don't claim you built it at a hackathon without sleeping.

---

<div align="center">
  Built with too much caffeine and a deep hatred for navigating 12 different AI provider pricing pages.
</div>
