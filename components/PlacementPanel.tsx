"use client";

import { useMemo, useState } from "react";
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

const students = [
  { name: "Aarav Sharma", branch: "Computer Science", cgpa: 8.7, technical: 88, communication: 82, readiness: 84 },
  { name: "Meera Nair", branch: "Computer Science", cgpa: 7.9, technical: 72, communication: 76, readiness: 74 },
  { name: "Nikhil Rao", branch: "Electrical", cgpa: 8.1, technical: 79, communication: 68, readiness: 72 },
  { name: "Ananya Pillai", branch: "Mechanical", cgpa: 7.3, technical: 61, communication: 71, readiness: 66 },
  { name: "Rohan Verma", branch: "Computer Science", cgpa: 8.9, technical: 91, communication: 85, readiness: 89 },
  { name: "Saanvi Joshi", branch: "Electrical", cgpa: 7.8, technical: 68, communication: 74, readiness: 71 },
  { name: "Aditya Singh", branch: "Mechanical", cgpa: 8.4, technical: 75, communication: 77, readiness: 76 },
  { name: "Pooja Bhat", branch: "Computer Science", cgpa: 8.2, technical: 81, communication: 79, readiness: 80 },
];

const branchOptions = ["All Branches", "Computer Science", "Electrical", "Mechanical"];

export default function PlacementPanel() {
  const [branch, setBranch] = useState("All Branches");
  const [threshold, setThreshold] = useState(75);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => branch === "All Branches" || student.branch === branch);
  }, [branch]);

  const summary = useMemo(() => {
    const ready = filteredStudents.filter((student) => student.readiness > threshold).length;
    const needsImprovement = filteredStudents.length - ready;
    const average = filteredStudents.length
      ? filteredStudents.reduce((sum, student) => sum + student.readiness, 0) / filteredStudents.length
      : 0;

    return { ready, needsImprovement, average };
  }, [filteredStudents, threshold]);

  const distribution = useMemo(() => {
    const buckets = [
      { label: "0–25", count: 0 },
      { label: "26–50", count: 0 },
      { label: "51–75", count: 0 },
      { label: "76–100", count: 0 },
    ];

    filteredStudents.forEach((student) => {
      if (student.readiness <= 25) buckets[0].count += 1;
      else if (student.readiness <= 50) buckets[1].count += 1;
      else if (student.readiness <= 75) buckets[2].count += 1;
      else buckets[3].count += 1;
    });

    return buckets;
  }, [filteredStudents]);

  return (
    <section className="space-y-4">
      <div className="sticky top-0 z-10 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Branch
            <select
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {branchOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Minimum Readiness Index
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                className="h-2 w-44 cursor-pointer appearance-none rounded-full bg-slate-200"
              />
              <span className="min-w-12 rounded-full bg-blue-600 px-3 py-1 text-center text-sm font-semibold text-white">
                {threshold}
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Students Ready" className="border-emerald-100 bg-emerald-50/70">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-slate-900">{summary.ready}</span>
            <span className="rounded-2xl bg-emerald-600 p-2 text-white">✅</span>
          </div>
        </Card>
        <Card title="Need Improvement" className="border-amber-100 bg-amber-50/70">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-slate-900">{summary.needsImprovement}</span>
            <span className="rounded-2xl bg-amber-500 p-2 text-white">🛠️</span>
          </div>
        </Card>
        <Card title="Avg Readiness Score" className="border-cyan-100 bg-cyan-50/70">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-slate-900">{summary.average.toFixed(1)}</span>
            <span className="rounded-2xl bg-cyan-600 p-2 text-white">📊</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <Card title="Readiness distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {distribution.map((entry, index) => (
                    <Cell key={entry.label} fill={index % 2 === 0 ? "#2563eb" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Placement candidates">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Branch</th>
                  <th className="py-2 pr-3">CGPA</th>
                  <th className="py-2 pr-3">Technical</th>
                  <th className="py-2">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const readinessClass = student.readiness > 75 ? "text-emerald-600" : student.readiness > 60 ? "text-amber-600" : "text-red-600";
                  return (
                    <tr key={student.name} className="border-b border-slate-100 transition hover:bg-slate-50">
                      <td className="py-3 pr-3 font-medium text-slate-800">{student.name}</td>
                      <td className="py-3 pr-3 text-slate-500">{student.branch}</td>
                      <td className="py-3 pr-3 text-slate-500">{student.cgpa.toFixed(1)}</td>
                      <td className="py-3 pr-3 text-slate-500">{student.technical}</td>
                      <td className={`py-3 font-semibold ${readinessClass}`}>{student.readiness}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
