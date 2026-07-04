import { NextResponse } from "next/server";
import benchmark from "@/data/benchmark.json";

export async function GET() {
  return NextResponse.json(benchmark);
}
