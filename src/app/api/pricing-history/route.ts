import { NextResponse } from "next/server";
import { MODELS } from "@/data/models";
import { getDb, isDbConfigured } from "@/lib/db";

export const revalidate = 3600; // 1-hour cache

export interface PricePoint {
  date: string;
  inputPrice: number;
  outputPrice: number;
}

export interface ModelPricingHistory {
  modelId: string;
  name: string;
  color: string;
  history: PricePoint[];
}

// If no DB is configured, synthesize 30 days of static data from current prices
// so the chart always renders — even before Neon is wired up
function syntheticHistory(
  inputPrice: number,
  outputPrice: number,
  days = 30
): PricePoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      inputPrice,
      outputPrice,
    };
  });
}

export async function GET() {
  if (!isDbConfigured()) {
    // No database yet — return static data so the chart still renders
    const data: ModelPricingHistory[] = MODELS.map((m) => ({
      modelId: m.id,
      name: m.name,
      color: m.providerColor,
      history: syntheticHistory(m.inputPrice, m.outputPrice),
    }));
    return NextResponse.json({ data, source: "static" });
  }

  try {
    const sql = getDb();

    const rows = await sql`
      SELECT model_id, input_price, output_price, recorded_at::date::text AS date
      FROM pricing_history
      WHERE recorded_at >= NOW() - INTERVAL '90 days'
      ORDER BY model_id, recorded_at ASC
    ` as Array<{ model_id: string; input_price: string; output_price: string; date: string }>;

    // Group by model
    const grouped: Record<string, PricePoint[]> = {};
    for (const row of rows) {
      if (!grouped[row.model_id]) grouped[row.model_id] = [];
      grouped[row.model_id].push({
        date: row.date,
        inputPrice: Number(row.input_price),
        outputPrice: Number(row.output_price),
      });
    }

    const data: ModelPricingHistory[] = MODELS.map((m) => ({
      modelId: m.id,
      name: m.name,
      color: m.providerColor,
      history: grouped[m.id] ?? syntheticHistory(m.inputPrice, m.outputPrice),
    }));

    return NextResponse.json({ data, source: "db" });
  } catch (err) {
    console.error("pricing-history DB error:", err);
    // Fallback to static on DB error
    const data: ModelPricingHistory[] = MODELS.map((m) => ({
      modelId: m.id,
      name: m.name,
      color: m.providerColor,
      history: syntheticHistory(m.inputPrice, m.outputPrice),
    }));
    return NextResponse.json({ data, source: "static-fallback" });
  }
}
