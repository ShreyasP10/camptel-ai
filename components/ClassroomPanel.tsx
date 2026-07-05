"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./ui/Card";
import EmptyState from "./ui/EmptyState";
import ErrorCard from "./ui/ErrorCard";
import Spinner from "./ui/Spinner";

type Slot = {
  time: string;
  utilization: number;
  room: string;
  status: string;
};

type DaySchedule = {
  day: string;
  slots: Slot[];
};

const dateOptions = ["2026-07-06", "2026-07-07"];

function UtilizationBar({ value }: { value: number }) {
  const color = value < 40 ? "bg-emerald-500" : value < 80 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

const times = ["08:00", "10:00", "12:00", "14:00"];

export default function ClassroomPanel() {
  const [selectedDate, setSelectedDate] = useState("2026-07-06");
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/classroom?date=${selectedDate}`);
      const data = await res.json();
      const util = data.utilization || [];

      if (Array.isArray(util) && util.length > 0 && util[0].slots) {
        setSchedule(util as DaySchedule[]);
      } else {
        setSchedule([]);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const summary = useMemo(() => {
    const totalSlots = schedule.reduce((sum, day) => sum + day.slots.length, 0);
    const booked = schedule.reduce((sum, day) => sum + day.slots.filter((s) => s.utilization >= 70).length, 0);
    const available = totalSlots - booked;
    const alerts = schedule.reduce((sum, day) => sum + day.slots.filter((s) => s.utilization >= 90).length, 0);
    return { booked, available, alerts };
  }, [schedule]);

  const conflicts = useMemo(() => {
    return schedule.flatMap((day) =>
      day.slots.filter((s) => s.utilization >= 90).map((s) => ({ ...s, day: day.day }))
    );
  }, [schedule]);

  return (
    <section className="space-y-5">
      <div className="sticky top-0 z-10 rounded-xl border border-surface-200 bg-white/90 p-4 shadow-sm backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-600">
            Date
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-700 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {dateOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-500">
            {selectedDate}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-surface-200 bg-white p-8">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorCard title="Classroom view could not be refreshed" onRetry={fetchSchedule} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" title="Rooms Booked">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.booked}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-lg">🗓️</div>
              </div>
            </Card>
            <Card variant="bordered" title="Available Rooms">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-surface-900">{summary.available}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg">🪑</div>
              </div>
            </Card>
            <Card variant="bordered" title="Over-capacity Alerts">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-red-600">{summary.alerts}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-lg">🚨</div>
              </div>
            </Card>
          </div>

          <Card title="Utilisation heatmap" subtitle="Colour intensity shows room usage">
            <div className="grid gap-4">
              <div className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-2 text-xs font-semibold uppercase tracking-wide text-surface-400">
                <div />
                {schedule.map((day) => (
                  <div key={day.day} className="rounded-lg bg-surface-50 p-2.5 text-center text-surface-600">
                    {day.day}
                  </div>
                ))}
              </div>
              {times.map((time) => (
                <div key={time} className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-2">
                  <div className="flex items-center text-sm font-medium text-surface-400">{time}</div>
                  {schedule.map((day) => {
                    const slot = day.slots.find((e) => e.time === time);
                    if (!slot) return <div key={`${day.day}-${time}`} className="h-14 rounded-lg border border-dashed border-surface-200" />;
                    const bg = slot.utilization < 40 ? "bg-emerald-50 text-emerald-700" : slot.utilization < 80 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
                    return (
                      <div
                        key={`${day.day}-${time}`}
                        title={`${slot.room} • ${slot.utilization}% • ${slot.status}`}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg p-2.5 text-center text-xs font-semibold ${bg}`}
                      >
                        <span>{slot.utilization}%</span>
                        <UtilizationBar value={slot.utilization} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Conflict alerts" subtitle={`Active on ${selectedDate}`}>
            {conflicts.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {conflicts.map((c) => (
                  <div key={`${c.day}-${c.room}`} className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-sm">🚨</span>
                      <div>
                        <p className="font-semibold text-red-800">{c.day} • {c.room}</p>
                        <p className="text-sm text-red-600">{c.status} — {c.utilization}% utilised</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="✅" title="All rooms available" description="No over-capacity rooms detected." />
            )}
          </Card>
        </>
      )}
    </section>
  );
}
