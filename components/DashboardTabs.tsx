"use client";

import { useState } from "react";
import AcademicRiskPanel from "./AcademicRiskPanel";
import ClassroomPanel from "./ClassroomPanel";
import PlacementPanel from "./PlacementPanel";

const tabs = [
  { id: "academic", label: "Academic Risk" },
  { id: "placement", label: "Placement Readiness" },
  { id: "classroom", label: "Classroom Utilisation" },
] as const;

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("academic");

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-6 text-white shadow-2xl shadow-blue-500/20 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">
          Decision Intelligence
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Decision Intelligence Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-base text-blue-50/90 sm:text-lg">
          Real-time insights across academic, placement, and infrastructure data.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md ring-1 ring-blue-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          {activeTab === "academic" && <AcademicRiskPanel />}
          {activeTab === "placement" && <PlacementPanel />}
          {activeTab === "classroom" && <ClassroomPanel />}
        </div>
      </div>
    </section>
  );
}
