import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const password = createHash("md5").update("P@ssw0rd").digest("hex");
  await prisma.user.create({
    data: {
      email: "agunginsanialam@gmail.com",
      name: "Agung Insani Alam",
      dob: new Date('1993-1-4').toISOString(),
      gender: "male",
      password,
      role: { create: { name: "ADMIN" } },
    },
  });
  await prisma.user.create({
    data: {
      email: "izzatijah@gmail.com",
      name: "Izzati Choirina Fajrin",
      dob: new Date('1994-1-18').toISOString(),
      gender: "female",
      password,
      role: { create: { name: "USER" } },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
