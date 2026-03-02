-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('PERMANENT', 'LABOUR_HIRE');

-- CreateEnum
CREATE TYPE "PermanentClass" AS ENUM ('FULL_TIME', 'PART_TIME', 'CASUAL');

-- CreateEnum
CREATE TYPE "TimeCode" AS ENUM ('NORMAL', 'OVERTIME_1_5', 'OVERTIME_2_0', 'PUBLIC_HOLIDAY', 'ANNUAL_LEAVE', 'PERSONAL_LEAVE', 'RDO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "employmentType" "EmploymentType" NOT NULL,
    "permanentClass" "PermanentClass",
    "labourHireCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "myobJobCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayPeriod" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimesheetDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "payPeriodId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "TimesheetDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL,
    "timesheetDayId" TEXT NOT NULL,
    "jobId" TEXT,
    "timeCode" "TimeCode" NOT NULL,
    "hours" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job_myobJobCode_key" ON "Job"("myobJobCode");

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetDay_userId_date_key" ON "TimesheetDay"("userId", "date");

-- AddForeignKey
ALTER TABLE "TimesheetDay" ADD CONSTRAINT "TimesheetDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetDay" ADD CONSTRAINT "TimesheetDay_payPeriodId_fkey" FOREIGN KEY ("payPeriodId") REFERENCES "PayPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_timesheetDayId_fkey" FOREIGN KEY ("timesheetDayId") REFERENCES "TimesheetDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
