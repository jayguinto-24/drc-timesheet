import { redirect } from "next/navigation";

export default function TimesheetIndex() {
  const today = new Date().toISOString().slice(0, 10);
  redirect(`/timesheet/${today}`);
}