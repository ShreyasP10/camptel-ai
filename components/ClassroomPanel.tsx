"use client";

import { useEffect, useMemo, useState } from "react";
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

const scheduleByDate: Record<string, DaySchedule[]> = {
  "2026-07-06": [
    { day: "Mon", slots: [
      { time: "08:00", utilization: 25, room: "Lab 1", status: "Low load" },
      { time: "10:00", utilization: 78, room: "Seminar 2", status: "Steady" },
      { time: "12:00", utilization: 92, room: "Auditorium A", status: "Over-capacity" },
      { time: "14:00", utilization: 64, room: "Room 204", status: "Balanced" },
    ] },
    { day: "Tue", slots: [
      { time: "08:00", utilization: 41, room: "Lab 3", status: "Moderate" },
      { time: "10:00", utilization: 83, room: "Room 101", status: "Busy" },
      { time: "12:00", utilization: 48, room: "Conference 2", status: "Moderate" },
      { time: "14:00", utilization: 31, room: "Room 310", status: "Low load" },
    ] },
    { day: "Wed", slots: [
      { time: "08:00", utilization: 89, room: "Lab 5", status: "High" },
      { time: "10:00", utilization: 58, room: "Room 202", status: "Balanced" },
      { time: "12:00", utilization: 74, room: "Seminar 1", status: "Steady" },
      { time: "14:00", utilization: 96, room: "Auditorium B", status: "Over-capacity" },
    ] },
    { day: "Thu", slots: [
      { time: "08:00", utilization: 37, room: "Room 402", status: "Low load" },
      { time: "10:00", utilization: 91, room: "Lab 4", status: "High" },
      { time: "12:00", utilization: 53, room: "Room 305", status: "Balanced" },
      { time: "14:00", utilization: 69, room: "Room 110", status: "Steady" },
    ] },
    { day: "Fri", slots: [
      { time: "08:00", utilization: 22, room: "Room 109", status: "Low load" },
      { time: "10:00", utilization: 40, room: "Lab 2", status: "Moderate" },
      { time: "12:00", utilization: 56, room: "Room 217", status: "Balanced" },
      { time: "14:00", utilization: 81, room: "Conference 1", status: "Busy" },
    ] },
  ],
  "2026-07-07": [
    { day: "Mon", slots: [
      { time: "08:00", utilization: 35, room: "Lab 1", status: "Low load" },
      { time: "10:00", utilization: 66, room: "Seminar 2", status: "Steady" },
      { time: "12:00", utilization: 82, room: "Auditorium A", status: "Busy" },
      { time: "14:00", utilization: 54, room: "Room 204", status: "Balanced" },
    ] },
    { day: "Tue", slots: [
      { time: "08:00", utilization: 61, room: "Lab 3", status: "Moderate" },
      { time: "10:00", utilization: 73, room: "Room 101", status: "Balanced" },
      { time: "12:00", utilization: 44, room: "Conference 2", status: "Moderate" },
      { time: "14:00", utilization: 29, room: "Room 310", status: "Low load" },
    ] },
    { day: "Wed", slots: [
      { time: "08:00", utilization: 88, room: "Lab 5", status: "High" },
      { time: "10:00", utilization: 57, room: "Room 202", status: "Balanced" },
      { time: "12:00", utilization: 91, room: "Seminar 1", status: "Over-capacity" },
      { time: "14:00", utilization: 63, room: "Auditorium B", status: "Steady" },
    ] },
    { day: "Thu", slots: [
      { time: "08:00", utilization: 24, room: "Room 402", status: "Low load" },
      { time: "10:00", utilization: 87, room: "Lab 4", status: "High" },
      { time: "12:00", utilization: 49, room: "Room 305", status: "Balanced" },
      { time: "14:00", utilization: 72, room: "Room 110", status: "Steady" },
    ] },
    { day: "Fri", slots: [
      { time: "08:00", utilization: 18, room: "Room 109", status: "Low load" },
      { time: "10:00", utilization: 33, room: "Lab 2", status: "Moderate" },
      { time: "12:00", utilization: 55, room: "Room 217", status: "Balanced" },
      { time: "14:00", utilization: 94, room: "Conference 1", status: "Over-capacity" },
    ] },
  ],
};

const dateOptions = ["2026-07-06", "2026-07-07"];

export default function ClassroomPanel() {
  const [selectedDate, setSelectedDate] = useState("2026-07-06");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setLoading(false);
      setError(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [selectedDate]);

  const schedule = useMemo(() => scheduleByDate[selectedDate] ?? [], [selectedDate]);
  const summary = useMemo(() => {
    const totalSlots = schedule.reduce((sum, day) => sum + day.slots.length, 0);
    const booked = schedule.reduce((sum, day) => sum + day.slots.filter((slot) => slot.utilization >= 70).length, 0);
    const available = totalSlots - booked;
    const alerts = schedule.reduce((sum, day) => sum + day.slots.filter((slot) => slot.utilization >= 90).length, 0);
    return { booked, available, alerts };
  }, [schedule]);

  const conflicts = useMemo(() => {
    return schedule.flatMap((day) => day.slots.filter((slot) => slot.utilization >= 90).map((slot) => ({ ...slot, day: day.day })));
  }, [schedule]);

  return (
    <section className="space-y-4">
      <div className="sticky top-0 z-10 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Date
          <select
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            {dateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorCard title="Classroom view could not be refreshed" onRetry={() => setError(false)} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Rooms Booked" className="border-cyan-100 bg-cyan-50/70">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-slate-900">{summary.booked}</span>
                <span className="rounded-2xl bg-cyan-600 p-2 text-white">🗓️</span>
              </div>
            </Card>
            <Card title="Available Rooms" className="border-emerald-100 bg-emerald-50/70">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-slate-900">{summary.available}</span>
                <span className="rounded-2xl bg-emerald-600 p-2 text-white">🪑</span>
              </div>
            </Card>
            <Card title="Over-capacity Alerts" className="border-red-100 bg-red-50/70">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-slate-900">{summary.alerts}</span>
                <span className="rounded-2xl bg-red-500 p-2 text-white">🚨</span>
              </div>
            </Card>
          </div>

          <Card title="Utilisation heatmap">
            <div className="grid gap-3">
              <div className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <div />
                {schedule.map((day) => (
                  <div key={day.day} className="rounded-xl bg-slate-50 p-2 text-center">
                    {day.day}
                  </div>
                ))}
              </div>
              {['08:00', '10:00', '12:00', '14:00'].map((time) => (
                <div key={time} className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-2">
                  <div className="flex items-center text-sm font-medium text-slate-500">{time}</div>
                  {schedule.map((day) => {
                    const slot = day.slots.find((entry) => entry.time === time);
                    if (!slot) return <div key={`${day.day}-${time}`} className="h-12 rounded-xl border border-dashed border-slate-200" />;
                    const color = slot.utilization < 40 ? "bg-emerald-100 text-emerald-700" : slot.utilization < 80 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
                    return (
                      <div key={`${day.day}-${time}`} title={`${slot.room} • ${slot.utilization}% • ${slot.status}`} className={`flex h-12 items-center justify-center rounded-xl border border-white text-center text-xs font-semibold ${color}`}>
                        {slot.utilization}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Conflict alerts">
            {conflicts.length ? (
              <div className="space-y-3">
                {conflicts.map((conflict) => (
                  <div key={`${conflict.day}-${conflict.room}`} className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <p className="font-semibold">{conflict.day} • {conflict.room}</p>
                    <p>{conflict.status} • {conflict.utilization}% utilised</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="All rooms available" description="No over-capacity rooms were detected for this date." />
            )}
          </Card>
        </>
      )}
    </section>
  );
}
