import { z } from "zod";

export const daySchema = z.object({
  date: z.string().min(10), // YYYY-MM-DD
});

export const entryUpsertSchema = z.object({
  timesheetDayId: z.string().min(1),
  id: z.string().optional(),
  jobId: z.string().nullable().optional(),
  timeCode: z.enum([
    "NORMAL",
    "OVERTIME_1_5",
    "OVERTIME_2_0",
    "PUBLIC_HOLIDAY",
    "ANNUAL_LEAVE",
    "PERSONAL_LEAVE",
    "RDO",
  ]),
  hours: z.number().positive().max(24),
  notes: z.string().max(500).optional(),
});