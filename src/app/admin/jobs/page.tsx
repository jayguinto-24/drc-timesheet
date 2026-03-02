import { prisma } from "@/lib/prisma";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({ orderBy: [{ isOpen: "desc" }, { myobJobCode: "asc" }], take: 200 });

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Admin — Jobs</h1>
      <p className="text-sm opacity-70">This list powers the “Open Jobs” dropdown.</p>

      <div className="border rounded">
        <div className="grid grid-cols-3 gap-2 p-2 text-xs font-semibold border-b">
          <div>MYOB Code</div>
          <div>Name</div>
          <div>Status</div>
        </div>
        {jobs.map((j) => (
          <div key={j.id} className="grid grid-cols-3 gap-2 p-2 text-sm border-b last:border-b-0">
            <div>{j.myobJobCode}</div>
            <div>{j.name}</div>
            <div>{j.isOpen ? "Open" : "Closed"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}