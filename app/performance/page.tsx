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

interface Benchmark {
  task: string;
  pandas_time_sec: number;
  cudf_time_sec: number;
  speedup: number;
  dataset_size: string;
}

export default function PerformancePage() {
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);

  useEffect(() => {
    fetch("/api/acceleration")
      .then((r) => r.json())
      .then((data) => {
        setBenchmark(data);
        setLoading(false);
        setShowConfetti(true);
      })
      .catch(() => {
        setLoading(false);
        setShowConfetti(true);
      });
  }, []);

  const speedup = useMemo(
    () => (benchmark ? benchmark.speedup.toFixed(1) : "—"),
    [benchmark]
  );

  const chartData = useMemo(
    () =>
      benchmark
        ? [
            { name: "Pandas", time: benchmark.pandas_time_sec },
            { name: "cuDF", time: benchmark.cudf_time_sec },
          ]
        : [],
    [benchmark]
  );

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
                  left: `${20 + (i * 3) % 60}%`,
                  "--offset": `${(i - 12) * 8}px`,
                  transform: `rotate(${i * 15}deg)`,
                  animation: `confetti-fall 1.2s ease-out forwards`,
                  animationDelay: `${i * 20}ms`,
                } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg shadow-amber-600/20">
          ⚡
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-dark-800 transition-colors">
          GPU Acceleration Proof
        </h1>
        <p className="mt-2 text-surface-500 dark:text-dark-500 transition-colors">
          See how NVIDIA RAPIDS cuDF makes our insights lightning fast.
        </p>
      </div>

      <Card variant="glass" className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-surface-400 dark:text-dark-500">
          Dataset
        </p>
        <p className="mt-3 text-lg font-medium text-surface-700 dark:text-dark-700">
          {benchmark?.dataset_size ?? "1.2 million attendance records from 50,000 students over 1 year."}
        </p>
      </Card>

      {loading ? (
        <div className="rounded-2xl border border-surface-200 bg-white p-16 shadow-sm dark:border-dark-200 dark:bg-dark-100 transition-colors duration-300">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            <Card title="Pandas (CPU)" className="border-surface-200 bg-surface-100 dark:border-dark-200 dark:bg-dark-50">
              <div className="flex flex-col items-center py-4">
                <p className="text-5xl font-bold text-surface-900 dark:text-dark-800">{benchmark?.pandas_time_sec ?? "—"}s</p>
                <p className="mt-2 text-sm text-surface-400 dark:text-dark-500">on 8-core CPU</p>
              </div>
            </Card>
            <Card title="cuDF (GPU)" className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-dark-50">
              <div className="flex flex-col items-center py-4">
                <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{benchmark?.cudf_time_sec ?? "—"}s</p>
                <p className="mt-2 text-sm text-surface-400 dark:text-dark-500">on NVIDIA T4 GPU</p>
              </div>
            </Card>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-indigo-50 p-8 text-center shadow-sm dark:border-brand-800 dark:from-brand-950/30 dark:to-dark-50 transition-colors duration-300">
            <p className="text-7xl font-bold text-brand-600 dark:text-brand-400">{speedup}x</p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-500 dark:text-brand-400">
              Real-time risk analysis enabled
            </p>
          </div>

          <Card title="Benchmark comparison" subtitle="Pandas vs cuDF execution time">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", background: "white" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-lg dark:border-dark-200 dark:bg-dark-100">
                          <p className="font-semibold text-surface-800 dark:text-dark-800">{payload[0].payload.name}</p>
                          <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">{payload[0].value}s</p>
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
            <ol className="space-y-4 text-sm text-surface-600 dark:text-dark-600">
              {[
                "Raw CSV data is loaded into memory.",
                "Pandas applies group-by on CPU, which is relatively slow.",
                "With import cudf.pandas, the same workflow runs on GPU with massive parallelism.",
                `Result: ${speedup}x faster feature engineering for risk scores.`,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
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
