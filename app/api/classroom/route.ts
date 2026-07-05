import { NextRequest, NextResponse } from "next/server";
import { queryBigQuery, getDatasetPrefix } from "@/lib/BigQuery";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "";

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  try {
    const prefix = getDatasetPrefix();
    const sql = `
      SELECT room_no AS room, date, time_slot AS timeSlot,
             capacity, occupancy, utilization_pct AS utilization
      FROM \`${process.env.GCP_PROJECT_ID}.${prefix}.classroom_utilization\`
      WHERE date = @date
      ORDER BY time_slot
    `;
    const rows = await queryBigQuery(sql, { date });
    return NextResponse.json({ utilization: rows, date });
  } catch (error) {
    console.error("classroom API error:", error);
    return NextResponse.json({ error: "Failed to query classroom data" }, { status: 500 });
  }
}
