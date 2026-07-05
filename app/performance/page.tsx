"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

const benchmarkChart = [
  { name: "Pandas", time: 45.2 },
  { name: "cuDF", time: 4.1 },
];

export default function PerformancePage() {
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setShowConfetti(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  const speedup = useMemo(() => (45.2 / 4.1).toFixed(1), []);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 left-1/2 h-3 w-2 rounded-full opacity-80"
              style={{
                background: i % 2 === 0 ? "#2563eb" : "#10b981",
                transform: `translateX(-50%) rotate(${i * 15}deg)`,
                animation: `confetti-fall 1.2s ease-out forwards`,
                animationDelay: `${i * 20}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg shadow-amber-600/20">
          ⚡
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900">
          GPU Acceleration Proof
        </h1>
        <p className="mt-2 text-surface-500">
          See how NVIDIA RAPIDS cuDF makes our insights lightning fast.
        </p>
      </div>

      <Card variant="glass" className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-surface-400">
          Dataset
        </p>
        <p className="mt-3 text-lg font-medium text-surface-700">
          1.2 million attendance records from 50,000 students over 1 year.
        </p>
      </Card>

      {loading ? (
        <div className="rounded-2xl border border-surface-200 bg-white p-16 shadow-sm">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            <Card title="Pandas (CPU)" className="border-surface-200 bg-surface-100">
              <div className="flex flex-col items-center py-4">
                <p className="text-5xl font-bold text-surface-900">45.2s</p>
                <p className="mt-2 text-sm text-surface-400">on 8-core CPU</p>
              </div>
            </Card>
            <Card title="cuDF (GPU)" className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <div className="flex flex-col items-center py-4">
                <p className="text-5xl font-bold text-emerald-600">4.1s</p>
                <p className="mt-2 text-sm text-surface-400">on NVIDIA T4 GPU</p>
              </div>
            </Card>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-indigo-50 p-8 text-center shadow-sm">
            <p className="text-7xl font-bold text-brand-600">{speedup}x</p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">
              Real-time risk analysis enabled
            </p>
          </div>

          <Card title="Benchmark comparison" subtitle="Pandas vs cuDF execution time">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-lg">
                          <p className="font-semibold text-surface-800">{payload[0].payload.name}</p>
                          <p className="mt-1 text-sm text-brand-600">{payload[0].value}s</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="time" radius={[8, 8, 0, 0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="How it works" variant="glass">
            <ol className="space-y-4 text-sm text-surface-600">
              {[
                "Raw CSV data is loaded into memory.",
                "Pandas applies group-by on CPU, which is relatively slow.",
                "With import cudf.pandas, the same workflow runs on GPU with massive parallelism.",
                "Result: 11x faster feature engineering for risk scores.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </>
      )}
    </main>
  );
}
