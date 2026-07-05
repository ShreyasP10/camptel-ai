"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./ui/Card";
import EmptyState from "./ui/EmptyState";
import ErrorCard from "./ui/ErrorCard";

type Student = {
  name: string;
  rollNo: string;
  course: string;
  attendance: number;
  marks: number;
  riskScore: number;
};

const courseOptions = ["All Courses", "Computer Science", "Electrical", "Mechanical"];

function RiskBadge({ score }: { score: number }) {
  if (score < 30) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Low</span>;
  }
  if (score <= 70) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Moderate</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">High</span>;
}

export default function AcademicRiskPanel() {
  const [course, setCourse] = useState("All Courses");
  const [riskThreshold, setRiskThreshold] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visibleRows, setVisibleRows] = useState(10);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ minRisk: String(riskThreshold) });
      if (course !== "All Courses") params.set("course", course);
      const res = await fetch(`/api/at-risk?${params}`);
      const data = await res.json();
      setStudents(data.students || []);
      setVisibleRows(10);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [course, riskThreshold]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const summary = useMemo(() => ({
    total: students.length,
    highRisk: students.filter((s) => s.riskScore > 75).length,
    average: students.length
      ? students.reduce((sum, s) => sum + s.riskScore, 0) / students.length
      : 0,
  }), [students]);

  const chartData = useMemo(() => {
    return [...students]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10)
      .map((s) => ({ ...s, shortName: s.name.length > 14 ? `${s.name.slice(0, 12)}…` : s.name }));
  }, [students]);

  const visibleStudents = students.slice(0, visibleRows);

  return (
    <section className="space-y-5">
      <div className="sticky top-0 z-10 rounded-xl border border-surface-200 bg-white/90 p-4 shadow-sm backdrop-blur-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600">
              Course
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-700 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                {courseOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600">
              Min Risk Score
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(Number(e.target.value))}
                  className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-surface-200 accent-brand-600"
                />
                <span className="inline-flex min-w-[3rem] items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-sm">
                  {riskThreshold}%
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm text-surface-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {students.length} student{students.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-100" />
          ))}
        </div>
      ) : error ? (
        <ErrorCard title="Unable to load academic risk data" onRetry={fetchStudents} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" title="Total Students">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.total}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-lg">📘</div>
              </div>
            </Card>
            <Card variant="bordered" title="High Risk (&gt;75%)">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-red-600">{summary.highRisk}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-lg">⚠️</div>
              </div>
            </Card>
            <Card variant="bordered" title="Average Risk Score">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.average.toFixed(1)}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-lg">📈</div>
              </div>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card title="At-risk students" subtitle="Top 10 by risk score">
              {chartData.length ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis type="category" dataKey="shortName" width={100} tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-lg">
                              <p className="font-semibold text-surface-800">{d.name}</p>
                              <p className="text-sm text-surface-400">{d.course} - {d.rollNo}</p>
                              <p className="mt-1 text-sm font-semibold text-brand-600">Risk: {d.riskScore}%</p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="riskScore" radius={[0, 8, 8, 0]} fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState icon="🔍" title="No students found" description="Try lowering the risk threshold." />
              )}
            </Card>

            <Card title="Student watchlist" subtitle="Attendance & risk overview">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 text-surface-400">
                      <th className="pb-3 pr-3 font-semibold">Name</th>
                      <th className="pb-3 pr-3 font-semibold">Roll No.</th>
                      <th className="pb-3 pr-3 font-semibold">Attendance</th>
                      <th className="pb-3 font-semibold">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((s) => (
                      <tr key={s.rollNo} className="border-b border-surface-50 transition hover:bg-surface-50">
                        <td className="py-3.5 pr-3 font-medium text-surface-800">{s.name}</td>
                        <td className="py-3.5 pr-3 text-surface-400">{s.rollNo}</td>
                        <td className="py-3.5 pr-3 text-surface-500">{s.attendance}%</td>
                        <td className="py-3.5"><RiskBadge score={s.riskScore} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {students.length > visibleRows && (
                <button
                  type="button"
                  onClick={() => setVisibleRows((v) => v + 10)}
                  className="mt-4 w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-600 transition hover:bg-surface-50 hover:text-surface-800"
                >
                  Show more ({students.length - visibleRows} remaining)
                </button>
              )}
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
