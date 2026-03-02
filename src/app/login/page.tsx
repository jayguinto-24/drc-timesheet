"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/timesheet",
    });

    if ((res as any)?.error) setErr("Login failed");
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>

      {err && <div className="rounded border p-3 text-sm">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input className="w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input className="w-full border rounded p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="border rounded px-3 py-2">Sign in</button>
      </form>
    </div>
  );
}