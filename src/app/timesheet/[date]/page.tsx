"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { JobSelect } from "@/components/JobSelect";

type TimeEntry = {
  id: string;
  jobId: string | null;
  timeCode: string;
  hours: string;
  notes: string | null;
};

type TimesheetDay = {
  id: string;
  entries: TimeEntry[];
  payPeriod: { startDate: string; endDate: string; isLocked: boolean };
};

const TIME_CODES = [
  "NORMAL",
  "OVERTIME_1_5",
  "OVERTIME_2_0",
  "PUBLIC_HOLIDAY",
  "ANNUAL_LEAVE",
  "PERSONAL_LEAVE",
  "RDO",
] as const;

export default function TimesheetDayPage() {
  const params = useParams<{ date: string }>();
  const date = params?.date; // string | undefined

  const [day, setDay] = useState<TimesheetDay | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDay(d: string) {
    setLoading(true);
    const res = await fetch("/api/timesheet/day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: d }),
    });
    const data = await res.json();
    setDay(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!date) return;
    loadDay(date);
  }, [date]);

  const locked = !!day?.payPeriod?.isLocked;

  const totalHours = useMemo(() => {
    if (!day) return 0;
    return day.entries.reduce((sum, e) => sum + Number(e.hours), 0);
  }, [day]);

  async function addLine() {
    if (!day || locked) return;
    await fetch("/api/timesheet/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timesheetDayId: day.id,
        jobId: null,
        timeCode: "NORMAL",
        hours: 0.5,
        notes: "",
      }),
    });
    if (date) await loadDay(date);
  }

  async function updateEntry(
    id: string,
    patch: Partial<{ jobId: string | null; timeCode: string; hours: number; notes: string }>
  ) {
    if (!day || locked) return;
    const entry = day.entries.find((e) => e.id === id);
    if (!entry) return;

    await fetch("/api/timesheet/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        timesheetDayId: day.id,
        jobId: patch.jobId ?? entry.jobId,
        timeCode: patch.timeCode ?? entry.timeCode,
        hours: patch.hours ?? Number(entry.hours),
        notes: patch.notes ?? entry.notes ?? "",
      }),
    });
    if (date) await loadDay(date);
  }

  if (!date) return <div>Loading route…</div>;
  if (loading) return <div>Loading…</div>;
  if (!day) return <div>Could not load timesheet day.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Timesheet — {date}</h1>
          <div className="text-sm opacity-70">
            Pay period: {day.payPeriod.startDate.slice(0, 10)} → {day.payPeriod.endDate.slice(0, 10)}
            {locked ? " (Locked)" : ""}
          </div>
        </div>
        <div className="text-sm">
          Total: <span className="font-semibold">{totalHours}</span> hrs
        </div>
      </div>

      <button className="border rounded px-3 py-2" onClick={addLine} disabled={locked}>
        Add line
      </button>

      <div className="space-y-3">
        {day.entries.map((e) => (
          <div key={e.id} className="border rounded p-3 grid gap-3 md:grid-cols-4">
            <div>
              <div className="text-xs opacity-70 mb-1">Job</div>
              <JobSelect value={e.jobId} onChange={(jobId) => updateEntry(e.id, { jobId })} />
            </div>

            <div>
              <div className="text-xs opacity-70 mb-1">Time code</div>
              <select
                className="w-full border rounded p-2"
                value={e.timeCode}
                onChange={(ev) => updateEntry(e.id, { timeCode: ev.target.value })}
                disabled={locked}
              >
                {TIME_CODES.map((tc) => (
                  <option key={tc} value={tc}>
                    {tc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-xs opacity-70 mb-1">Hours</div>
              <input
                className="w-full border rounded p-2"
                type="number"
                step="0.25"
                value={Number(e.hours)}
                onChange={(ev) => updateEntry(e.id, { hours: Number(ev.target.value) })}
                disabled={locked}
              />
            </div>

            <div>
              <div className="text-xs opacity-70 mb-1">Notes</div>
              <input
                className="w-full border rounded p-2"
                value={e.notes ?? ""}
                onChange={(ev) => updateEntry(e.id, { notes: ev.target.value })}
                disabled={locked}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}