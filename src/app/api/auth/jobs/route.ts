import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const openOnly = url.searchParams.get("open") !== "false";
  const q = (url.searchParams.get("q") ?? "").trim();

  const jobs = await prisma.job.findMany({
    where: {
      isOpen: openOnly ? true : undefined,
      ...(q
        ? {
            OR: [
              { myobJobCode: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ myobJobCode: "asc" }],
    take: 200,
  });

  return NextResponse.json(jobs);
}