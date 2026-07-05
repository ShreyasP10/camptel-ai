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
import Card from "./ui/Card";
import EmptyState from "./ui/EmptyState";
import ErrorCard from "./ui/ErrorCard";
import Spinner from "./ui/Spinner";

type Student = {
  name: string;
  rollNo: string;
  course: string;
  attendance: number;
  marks: number;
  riskScore: number;
};

const students: Student[] = [
  { name: "Aarav Sharma", rollNo: "CS-101", course: "Computer Science", attendance: 78, marks: 84, riskScore: 82 },
  { name: "Meera Nair", rollNo: "CS-102", course: "Computer Science", attendance: 65, marks: 71, riskScore: 68 },
  { name: "Nikhil Rao", rollNo: "EE-205", course: "Electrical", attendance: 58, marks: 66, riskScore: 88 },
  { name: "Ananya Pillai", rollNo: "ME-310", course: "Mechanical", attendance: 84, marks: 79, riskScore: 24 },
  { name: "Rohan Verma", rollNo: "CS-118", course: "Computer Science", attendance: 62, marks: 61, riskScore: 76 },
  { name: "Saanvi Joshi", rollNo: "EE-221", course: "Electrical", attendance: 73, marks: 77, riskScore: 41 },
  { name: "Karthik Menon", rollNo: "ME-336", course: "Mechanical", attendance: 54, marks: 57, riskScore: 91 },
  { name: "Pooja Bhat", rollNo: "CS-128", course: "Computer Science", attendance: 90, marks: 88, riskScore: 15 },
  { name: "Dev Patel", rollNo: "EE-254", course: "Electrical", attendance: 69, marks: 63, riskScore: 72 },
  { name: "Ishita Das", rollNo: "CS-137", course: "Computer Science", attendance: 59, marks: 68, riskScore: 81 },
  { name: "Aditya Singh", rollNo: "ME-348", course: "Mechanical", attendance: 76, marks: 74, riskScore: 32 },
  { name: "Tanya Kulkarni", rollNo: "CS-145", course: "Computer Science", attendance: 48, marks: 54, riskScore: 95 },
];

const courseOptions = ["All Courses", "Computer Science", "Electrical", "Mechanical"];

export default function AcademicRiskPanel() {
  const [course, setCourse] = useState("All Courses");
  const [riskThreshold, setRiskThreshold] = useState(0);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visibleRows, setVisibleRows] = useState(10);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = window.setTimeout(() => {
      const next = students.filter((student) => {
        const matchesCourse = course === "All Courses" || student.course === course;
        const matchesRisk = student.riskScore >= riskThreshold;
        return matchesCourse && matchesRisk;
      });
      setFilteredStudents(next);
      setVisibleRows(10);
      setLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [course, riskThreshold]);

  const summary = useMemo(() => ({
    total: filteredStudents.length,
    highRisk: filteredStudents.filter((student) => student.riskScore > 75).length,
    average: filteredStudents.length
      ? filteredStudents.reduce((sum, student) => sum + student.riskScore, 0) / filteredStudents.length
      : 0,
  }), [filteredStudents]);

  const chartData = useMemo(() => {
    return [...filteredStudents]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10)
      .map((student) => ({ ...student, shortName: student.name.length > 14 ? `${student.name.slice(0, 12)}…` : student.name }));
  }, [filteredStudents]);

  const visibleStudents = filteredStudents.slice(0, visibleRows);

  return (
    <section className="space-y-4">
      <div className="sticky top-0 z-10 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Course
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {courseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Minimum Risk Score
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={riskThreshold}
                onChange={(event) => setRiskThreshold(Number(event.target.value))}
                className="h-2 w-44 cursor-pointer appearance-none rounded-full bg-slate-200"
              />
              <span className="min-w-11 rounded-full bg-blue-600 px-3 py-1 text-center text-sm font-semibold text-white">
                {riskThreshold}%
              </span>
            </div>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <ErrorCard title="Unable to refresh academic risk" onRetry={() => setError(false)} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Total Students" className="border-blue-100 bg-blue-50/70">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-slate-900">{summary.total}</span>
                <span className="rounded-2xl bg-blue-600 p-2 text-white">📘</span>
              </div>
            </Card>
            <Card title="High Risk (>75%)" className="border-red-100 bg-red-50/70">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-red-700">{summary.highRisk}</span>
                <span className="rounded-2xl bg-red-500 p-2 text-white">⚠️</span>
              </div>
            </Card>
            <Card title="Average Risk Score" className="border-amber-100 bg-amber-50/70">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-slate-900">{summary.average.toFixed(1)}</span>
                <span className="rounded-2xl bg-amber-500 p-2 text-white">📈</span>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card title="At-risk students" className="min-h-[320px]">
              {chartData.length ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="shortName" width={100} tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Risk Score"]}
                        labelFormatter={(label) => `Student: ${label}`}
                      />
                      <Bar dataKey="riskScore" radius={[0, 10, 10, 0]} fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState title="No students found" description="Try lowering the risk threshold to reveal more students." />
              )}
            </Card>

            <Card title="Student watchlist" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Roll No.</th>
                      <th className="py-2 pr-3">Attendance</th>
                      <th className="py-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => {
                      const riskClass = student.riskScore < 30 ? "text-emerald-600" : student.riskScore <= 70 ? "text-amber-600" : "text-red-600";
                      return (
                        <tr key={student.rollNo} className="border-b border-slate-100 transition hover:bg-slate-50">
                          <td className="py-3 pr-3 font-medium text-slate-800">{student.name}</td>
                          <td className="py-3 pr-3 text-slate-500">{student.rollNo}</td>
                          <td className="py-3 pr-3 text-slate-500">{student.attendance}%</td>
                          <td className={`py-3 font-semibold ${riskClass}`}>{student.riskScore}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredStudents.length > visibleRows && (
                <button
                  type="button"
                  onClick={() => setVisibleRows((value) => value + 10)}
                  className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Load more
                </button>
              )}
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
