import { NextRequest, NextResponse } from "next/server";
import { queryBigQuery, getDatasetPrefix } from "@/lib/BigQuery";
import { generateWithGemini } from "@/lib/vertexai";

const SCHEMA = `
Tables (all in dataset campus_data):
- student_risk: roll_no, name, course, semester, attendance_pct, avg_marks, lms_engagement_score, risk_score
- placement_readiness: roll_no, name, branch, cgpa, technical_score, communication_score, internship_experience, readiness_index
- classroom_utilization: room_no, date, time_slot, booked_by, capacity, occupancy, utilization_pct
`;

export async function POST(request: NextRequest) {
  const { question } = await request.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Please provide a question." }, { status: 400 });
  }

  try {
    const projectId = process.env.GCP_PROJECT_ID;
    const dataset = getDatasetPrefix();

    // Step 1: Generate SQL from natural language
    const sqlPrompt = `Given a BigQuery project "${projectId}" and dataset "${dataset}" with the schema:\n${SCHEMA}\nWrite a SQL query to answer the following question. Return ONLY the SQL. No markdown, no explanation, no backticks.\nQuestion: ${question}`;

    const sqlQuery = await generateWithGemini(sqlPrompt);
    const cleanedSql = sqlQuery.replace(/```sql|```/gi, "").trim();

    if (!cleanedSql.toLowerCase().startsWith("select")) {
      throw new Error("Invalid SQL generated");
    }

    // Step 2: Execute on BigQuery (with fallback to mock)
    let rows: Record<string, unknown>[] = [];
    try {
      rows = await queryBigQuery(cleanedSql);
    } catch {
      // Return mock response if BigQuery is not configured
      return NextResponse.json({
        answer: `Based on the campus data, here's what I found for "${question}".\n\nThis is a simulated response — connect BigQuery to see live data. The SQL query would be executed against your ${dataset} dataset.`,
        sql: cleanedSql,
        rows: [],
        mock: true,
      });
    }

    // Step 3: Summarise results with Gemini
    const summaryPrompt = `You are a campus advisor. The user asked: "${question}". The database returned these rows (first 5 shown): ${JSON.stringify(rows.slice(0, 5))}. Total rows: ${rows.length}. Provide a concise, helpful answer with key numbers. Include actionable recommendations if appropriate.`;

    const answer = await generateWithGemini(summaryPrompt);

    return NextResponse.json({
      answer: answer || "Here are the results from the database.",
      sql: cleanedSql,
      rows: rows.slice(0, 20),
    });
  } catch (error) {
    console.error("ask-gemini error:", error);
    return NextResponse.json(
      { error: "Sorry, I could not answer that. Try rephrasing your question." },
      { status: 500 }
    );
  }
}
