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
import { exportToCSV } from "../lib/export";

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
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Low</span>;
  }
  if (score <= 70) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Moderate</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">High</span>;
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
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
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
          <div className="sticky top-0 z-10 rounded-xl border border-surface-200 bg-white/90 p-4 shadow-sm backdrop-blur-lg dark:border-dark-200 dark:bg-dark-100/90 transition-colors duration-300">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => exportToCSV(students, `at-risk-students`)}
                disabled={!students.length}
                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-500 transition hover:bg-surface-50 hover:text-surface-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-200 dark:bg-dark-100 dark:text-dark-500 dark:hover:bg-dark-50 dark:hover:text-dark-700"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                CSV
              </button>
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600 dark:text-dark-500">
              Course
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-700 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-dark-200 dark:bg-dark-50 dark:text-dark-700 dark:focus:border-brand-600 dark:focus:ring-brand-900"
              >
                {courseOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600 dark:text-dark-500">
              Min Risk Score
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(Number(e.target.value))}
                  className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-surface-200 accent-brand-600 dark:bg-dark-200 dark:accent-brand-400"
                />
                <span className="inline-flex min-w-[3rem] items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-sm">
                  {riskThreshold}%
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm text-surface-400 dark:text-dark-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {students.length} student{students.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-100 dark:bg-dark-100" />
          ))}
        </div>
      ) : error ? (
        <ErrorCard title="Unable to load academic risk data" onRetry={fetchStudents} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" title="Total Students">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900 dark:text-dark-800">{summary.total}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-lg dark:bg-brand-900/40">📘</div>
              </div>
            </Card>
            <Card variant="bordered" title="High Risk (&gt;75%)">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.highRisk}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-lg dark:bg-red-900/40">⚠️</div>
              </div>
            </Card>
            <Card variant="bordered" title="Average Risk Score">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900 dark:text-dark-800">{summary.average.toFixed(1)}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-lg dark:bg-amber-900/40">📈</div>
              </div>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card title="At-risk students" subtitle="Top 10 by risk score">
              {chartData.length ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis type="category" dataKey="shortName" width={100} tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          background: "white",
                        }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-lg dark:border-dark-200 dark:bg-dark-100">
                              <p className="font-semibold text-surface-800 dark:text-dark-800">{d.name}</p>
                              <p className="text-sm text-surface-400 dark:text-dark-500">{d.course} - {d.rollNo}</p>
                              <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-400">Risk: {d.riskScore}%</p>
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
                    <tr className="border-b border-surface-100 text-surface-400 dark:border-dark-200 dark:text-dark-500">
                      <th className="pb-3 pr-3 font-semibold">Name</th>
                      <th className="pb-3 pr-3 font-semibold">Roll No.</th>
                      <th className="pb-3 pr-3 font-semibold">Attendance</th>
                      <th className="pb-3 font-semibold">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((s) => (
                      <tr key={s.rollNo} className="border-b border-surface-50 transition hover:bg-surface-50 dark:border-dark-50 dark:hover:bg-dark-50">
                        <td className="py-3.5 pr-3 font-medium text-surface-800 dark:text-dark-800">{s.name}</td>
                        <td className="py-3.5 pr-3 text-surface-400 dark:text-dark-500">{s.rollNo}</td>
                        <td className="py-3.5 pr-3 text-surface-500 dark:text-dark-500">{s.attendance}%</td>
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
                  className="mt-4 w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-600 transition hover:bg-surface-50 hover:text-surface-800 dark:border-dark-200 dark:text-dark-500 dark:hover:bg-dark-50 dark:hover:text-dark-700"
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
