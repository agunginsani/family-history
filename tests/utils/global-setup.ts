import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

export const user = {
  email: "fake@gmail.com",
  name: "Fake Account",
  dob: faker.date.birthdate().toISOString(),
  gender: faker.name.sex(),
  password: "dummypassword",
  role: {
    create: { name: "ADMIN" },
  },
};

export default async () => {
  const prisma = new PrismaClient();

  async function main() {
    await prisma.user.create({
      data: {
        ...user,
        password: createHash("md5").update(user.password).digest("hex"),
      },
    });
  }

  await main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
};
