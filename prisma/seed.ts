import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("TempPass123!", 10);

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@drc.local" },
    update: {},
    create: {
      email: "admin@drc.local",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      employmentType: "PERMANENT",
      permanentClass: "FULL_TIME",
    },
  });

  // Example employee
  await prisma.user.upsert({
    where: { email: "employee@drc.local" },
    update: {},
    create: {
      email: "employee@drc.local",
      name: "Employee One",
      passwordHash,
      role: "EMPLOYEE",
      employmentType: "PERMANENT",
      permanentClass: "FULL_TIME",
    },
  });

  console.log("Seeded users:");
  console.log("- admin@drc.local / TempPass123!");
  console.log("- employee@drc.local / TempPass123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });