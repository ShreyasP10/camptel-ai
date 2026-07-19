import { NextRequest, NextResponse } from "next/server";
import { queryBigQuery, getDatasetPrefix } from "@/lib/BigQuery";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course") || "All Courses";
  const minRisk = parseInt(searchParams.get("minRisk") || "0", 10);

  try {
    const prefix = getDatasetPrefix();
    let sql = `
      SELECT roll_no AS rollNo, name, course, attendance_pct AS attendance,
             avg_marks AS marks, risk_score AS riskScore
      FROM \`${process.env.GCP_PROJECT_ID}.${prefix}.student_risk\`
      WHERE risk_score >= @minRisk
    `;
    const params: Record<string, unknown> = { minRisk };

    if (course !== "All Courses") {
      sql += ` AND course = @course`;
      params.course = course;
    }
    sql += ` ORDER BY riskScore DESC LIMIT 50`;

    const rows = await queryBigQuery(sql, params);
    return NextResponse.json({ students: rows });
  } catch (error) {
    console.error("at-risk API error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
