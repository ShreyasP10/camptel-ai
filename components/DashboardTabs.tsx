"use client";

import { useState } from "react";
import AcademicRiskPanel from "./AcademicRiskPanel";
import ClassroomPanel from "./ClassroomPanel";
import PlacementPanel from "./PlacementPanel";

const tabs = [
  { id: "academic", label: "Academic Risk", icon: "📊" },
  { id: "placement", label: "Placement Readiness", icon: "🎯" },
  { id: "classroom", label: "Classroom Utilisation", icon: "🏛️" },
] as const;

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("academic");

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 p-8 text-white shadow-2xl shadow-brand-600/25 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200">
            CampusPulse Analytics
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Decision Intelligence Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base text-brand-100/80 sm:text-lg">
            Real-time insights across academic, placement, and infrastructure data.
            Identify at-risk students, track placement readiness, and optimise classroom usage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
              Updated daily
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-2 shadow-sm">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                    : "text-surface-500 hover:bg-surface-100 hover:text-surface-700"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-2 animate-fade-in">
          {activeTab === "academic" && <AcademicRiskPanel />}
          {activeTab === "placement" && <PlacementPanel />}
          {activeTab === "classroom" && <ClassroomPanel />}
        </div>
      </div>
    </section>
  );
}
