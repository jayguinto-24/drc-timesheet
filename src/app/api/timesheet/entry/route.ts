import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { entryUpsertSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  const parsed = entryUpsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id, timesheetDayId, jobId, timeCode, hours, notes } = parsed.data;

  // Basic validation rule: NORMAL / OT must have a job
  const requiresJob = ["NORMAL", "OVERTIME_1_5", "OVERTIME_2_0"].includes(timeCode);
  if (requiresJob && !jobId) {
    return NextResponse.json({ error: "Job is required for this time code" }, { status: 400 });
  }

  const entry = id
    ? await prisma.timeEntry.update({
        where: { id },
        data: {
          jobId: jobId ?? null,
          timeCode,
          hours: hours as any,
          notes: notes ?? null,
        },
      })
    : await prisma.timeEntry.create({
        data: {
          timesheetDayId,
          jobId: jobId ?? null,
          timeCode,
          hours: hours as any,
          notes: notes ?? null,
        },
      });

  return NextResponse.json(entry);
}