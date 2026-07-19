import { NextRequest, NextResponse } from "next/server";
import { queryBigQuery, getDatasetPrefix } from "@/lib/BigQuery";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStatus(utilization: number): string {
  if (utilization < 40) return "Low load";
  if (utilization < 60) return "Moderate";
  if (utilization < 80) return "Steady";
  if (utilization < 90) return "Busy";
  return "Over-capacity";
}

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

    // Group by day
    const dayIndex = new Date(rows[0]?.date || date).getDay();
    const dayName = DAY_NAMES[dayIndex];

    const grouped = [
      {
        day: dayName,
        slots: (rows as Array<{ timeSlot: string; room: string; utilization: number }>).map((r) => ({
          time: r.timeSlot,
          utilization: r.utilization,
          room: r.room,
          status: getStatus(r.utilization),
        })),
      },
    ];

    return NextResponse.json({ utilization: grouped, date });
  } catch (error) {
    console.error("classroom API error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
