import { NextRequest, NextResponse } from "next/server";
import { MODELS } from "@/data/models";
import { getDb, isDbConfigured } from "@/lib/db";

// GET /api/pricing-snapshot — health check: returns last snapshot time per model
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ configured: false });
  }
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT model_id, MAX(recorded_at) AS last_recorded
      FROM pricing_history
      GROUP BY model_id
      ORDER BY model_id
    ` as Array<{ model_id: string; last_recorded: string }>;
    return NextResponse.json({ configured: true, snapshots: rows });
  } catch (err) {
    console.error("pricing-snapshot GET error:", err);
    return NextResponse.json({ error: "DB read failed" }, { status: 500 });
  }
}

// POST /api/pricing-snapshot
// Call this from a daily cron (e.g., Cloudflare Workers cron trigger or GitHub Actions)
// to record the current pricing. Protect with CRON_SECRET env var.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured" },
      { status: 503 }
    );
  }

  try {
    const sql = getDb();

    // Insert current pricing for each model — ON CONFLICT skips duplicate same-day rows
    await Promise.all(
      MODELS.map((m) =>
        sql`
          INSERT INTO pricing_history (model_id, input_price, output_price)
          VALUES (${m.id}, ${m.inputPrice}, ${m.outputPrice})
          ON CONFLICT (model_id, DATE(recorded_at)) DO NOTHING
        `
      )
    );

    return NextResponse.json({
      ok: true,
      recorded: MODELS.length,
      at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("pricing-snapshot error:", err);
    return NextResponse.json({ error: "DB write failed" }, { status: 500 });
  }
}
