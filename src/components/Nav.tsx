"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function Nav() {
  const { data } = useSession();

  return (
    <div className="border-b">
      <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">DRC Timesheets</Link>
        <div className="flex gap-4 items-center">
          <Link href="/timesheet">Timesheet</Link>
          {(data?.user as any)?.role === "ADMIN" && <Link href="/admin/jobs">Admin</Link>}
          {data?.user ? (
            <button className="underline" onClick={() => signOut({ callbackUrl: "/login" })}>
              Sign out
            </button>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </div>
      </div>
    </div>
  );
}