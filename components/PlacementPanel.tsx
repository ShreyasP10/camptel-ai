"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./ui/Card";
import ErrorCard from "./ui/ErrorCard";

type Student = {
  name: string;
  branch: string;
  cgpa: number;
  technical: number;
  communication: number;
  readiness: number;
};

const branchOptions = ["All Branches", "Computer Science", "Electrical", "Mechanical"];

function ReadinessBadge({ score }: { score: number }) {
  if (score > 75) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Ready</span>;
  }
  if (score > 60) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Needs work</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">At risk</span>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function PlacementPanel() {
  const [branch, setBranch] = useState("All Branches");
  const [threshold, setThreshold] = useState(75);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ minReadiness: String(threshold) });
      if (branch !== "All Branches") params.set("branch", branch);
      const res = await fetch(`/api/placement?${params}`);
      const data = await res.json();
      setStudents(data.readiness || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [branch, threshold]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const summary = useMemo(() => {
    const ready = students.filter((s) => s.readiness > threshold).length;
    const needsImprovement = students.length - ready;
    const average = students.length
      ? students.reduce((sum, s) => sum + s.readiness, 0) / students.length
      : 0;
    return { ready, needsImprovement, average };
  }, [students, threshold]);

  const distribution = useMemo(() => {
    const buckets = [
      { label: "0–25", count: 0 },
      { label: "26–50", count: 0 },
      { label: "51–75", count: 0 },
      { label: "76–100", count: 0 },
    ];
    students.forEach((s) => {
      if (s.readiness <= 25) buckets[0].count += 1;
      else if (s.readiness <= 50) buckets[1].count += 1;
      else if (s.readiness <= 75) buckets[2].count += 1;
      else buckets[3].count += 1;
    });
    return buckets;
  }, [students]);

  return (
    <section className="space-y-5">
      <div className="sticky top-0 z-10 rounded-xl border border-surface-200 bg-white/90 p-4 shadow-sm backdrop-blur-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600">
              Branch
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-700 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                {branchOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600">
              Min Readiness Index
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-surface-200 accent-brand-600"
                />
                <span className="inline-flex min-w-[3rem] items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-sm">
                  {threshold}
                </span>
              </div>
            </label>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-500">
            {students.length} candidate{students.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-100" />
          ))}
        </div>
      ) : error ? (
        <ErrorCard title="Unable to load placement data" onRetry={fetchStudents} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" title="Students Ready">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.ready}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg">✅</div>
              </div>
            </Card>
            <Card variant="bordered" title="Need Improvement">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.needsImprovement}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-lg">🛠️</div>
              </div>
            </Card>
            <Card variant="bordered" title="Avg Readiness Score">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.average.toFixed(1)}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-lg">📊</div>
              </div>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
            <Card title="Readiness distribution" subtitle="Breakdown by score range">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-lg">
                            <p className="font-semibold text-surface-800">{payload[0].payload.label}</p>
                            <p className="mt-1 text-sm text-brand-600">{payload[0].value} student{payload[0].value !== 1 ? "s" : ""}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {distribution.map((entry, i) => (
                        <Cell key={entry.label} fill={COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Placement candidates" subtitle="Detailed readiness overview">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 text-surface-400">
                      <th className="pb-3 pr-3 font-semibold">Name</th>
                      <th className="pb-3 pr-3 font-semibold">Branch</th>
                      <th className="pb-3 pr-3 font-semibold">CGPA</th>
                      <th className="pb-3 pr-3 font-semibold">Technical</th>
                      <th className="pb-3 font-semibold">Readiness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.name} className="border-b border-surface-50 transition hover:bg-surface-50">
                        <td className="py-3.5 pr-3 font-medium text-surface-800">{s.name}</td>
                        <td className="py-3.5 pr-3 text-surface-400">{s.branch}</td>
                        <td className="py-3.5 pr-3 text-surface-500">{s.cgpa.toFixed(1)}</td>
                        <td className="py-3.5 pr-3 text-surface-500">{s.technical}</td>
                        <td className="py-3.5"><ReadinessBadge score={s.readiness} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
