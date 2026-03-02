"use client";

import { useEffect, useState } from "react";

type Job = { id: string; myobJobCode: string; name: string };

export function JobSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (jobId: string | null) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/jobs?open=true&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setJobs(data);
    };
    run();
  }, [q]);

  return (
    <div className="space-y-1">
      <input
        className="w-full border rounded p-2 text-sm"
        placeholder="Search job (code or name)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select
        className="w-full border rounded p-2"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
      >
        <option value="">Select job…</option>
        {jobs.map((j) => (
          <option key={j.id} value={j.id}>
            {j.myobJobCode} — {j.name}
          </option>
        ))}
      </select>
    </div>
  );
}