import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const password = createHash("md5").update("P@ssw0rd").digest("hex");
  await prisma.user.create({
    data: {
      email: "agunginsanialam@gmail.com",
      name: "Agung Insani",
      password,
      role: { create: { name: "ADMIN" } },
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
