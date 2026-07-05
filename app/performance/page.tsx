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

const benchmark = [
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
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="absolute top-0 left-1/2 h-3 w-2 rounded-full opacity-80"
              style={{
                background: index % 2 === 0 ? "#2563eb" : "#10b981",
                transform: `translateX(-50%) rotate(${index * 15}deg)`,
                animation: `confetti-fall 1.2s ease-out forwards`,
                animationDelay: `${index * 20}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900">⚡ GPU Acceleration Proof</h1>
        <p className="mt-2 text-slate-600">
          See how NVIDIA RAPIDS cuDF makes our insights lightning fast.
        </p>
      </div>

      <Card className="bg-slate-50">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Dataset
        </p>
        <p className="mt-2 text-lg text-slate-700">
          1.2 million attendance records from 50,000 students over 1 year.
        </p>
      </Card>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <Card title="Pandas (CPU)" className="border-slate-200 bg-slate-100">
              <p className="text-4xl font-semibold text-slate-900">45.2s</p>
              <p className="mt-2 text-sm text-slate-500">on 8-core CPU</p>
            </Card>
            <div className="hidden text-4xl font-semibold text-slate-400 lg:block">↔</div>
            <Card title="cuDF (GPU)" className="border-emerald-200 bg-emerald-50">
              <p className="text-4xl font-semibold text-emerald-700">4.1s</p>
              <p className="mt-2 text-sm text-slate-500">on NVIDIA T4 GPU</p>
            </Card>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-center text-6xl font-semibold text-blue-600">{speedup}x</p>
            <p className="mt-2 text-center text-sm uppercase tracking-[0.3em] text-slate-500">real-time risk analysis enabled</p>
          </div>

          <Card title="Benchmark comparison">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmark}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="time" radius={[10, 10, 0, 0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="How it works">
            <ol className="space-y-2 text-sm text-slate-600">
              <li>1. Raw CSV data is loaded into memory.</li>
              <li>2. Pandas applies group-by on CPU, which is relatively slow.</li>
              <li>3. With import cudf.pandas, the same workflow runs on GPU with massive parallelism.</li>
              <li>4. Result: 11x faster feature engineering for risk scores.</li>
            </ol>
          </Card>
        </>
      )}
    </main>
  );
}
