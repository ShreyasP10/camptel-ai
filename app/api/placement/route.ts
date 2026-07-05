import { NextRequest, NextResponse } from "next/server";
import { queryBigQuery, getDatasetPrefix } from "@/lib/BigQuery";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get("branch") || "All Branches";
  const minReadiness = parseInt(searchParams.get("minReadiness") || "0", 10);

  try {
    const prefix = getDatasetPrefix();
    let sql = `
      SELECT name, branch, cgpa, technical_score AS technical,
             communication_score AS communication, readiness_index AS readiness
      FROM \`${process.env.GCP_PROJECT_ID}.${prefix}.placement_readiness\`
      WHERE readiness_index >= @minReadiness
    `;
    const params: Record<string, unknown> = { minReadiness };

    if (branch !== "All Branches") {
      sql += ` AND branch = @branch`;
      params.branch = branch;
    }
    sql += ` ORDER BY readiness DESC LIMIT 50`;

    const rows = await queryBigQuery(sql, params);
    return NextResponse.json({ readiness: rows });
  } catch (error) {
    console.error("placement API error:", error);
    return NextResponse.json({ error: "Failed to query placement data" }, { status: 500 });
  }
}
