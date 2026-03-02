import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { daySchema } from "@/lib/validators";
import { getPayPeriodForDate } from "@/lib/payPeroid";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  const parsed = daySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const date = new Date(parsed.data.date + "T00:00:00");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { start, end } = getPayPeriodForDate(date);

  const payPeriod =
    (await prisma.payPeriod.findFirst({
      where: { startDate: start, endDate: end },
    })) ??
    (await prisma.payPeriod.create({
      data: { startDate: start, endDate: end },
    }));

  const day =
    (await prisma.timesheetDay.findUnique({
      where: { userId_date: { userId: user.id, date } },
      include: { entries: { include: { job: true } }, payPeriod: true },
    })) ??
    (await prisma.timesheetDay.create({
      data: { userId: user.id, date, payPeriodId: payPeriod.id },
      include: { entries: { include: { job: true } }, payPeriod: true },
    }));

  return NextResponse.json(day);
}