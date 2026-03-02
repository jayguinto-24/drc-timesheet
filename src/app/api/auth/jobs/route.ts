import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client path

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  const where = q
    ? {
        isOpen: true,
        OR: [
          { myobJobCode: { contains: q } },
          { name: { contains: q } },
        ],
      }
    : { isOpen: true };

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { myobJobCode: "asc" },
    take: 100,
  });

  return NextResponse.json(jobs);
}