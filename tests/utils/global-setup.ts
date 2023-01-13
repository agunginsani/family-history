import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

export const user = {
  email: "fake@gmail.com",
  name: "Fake Account",
  dob: faker.date.birthdate().toISOString(),
  gender: faker.name.sex(),
  password: "dummypassword",
};

export default async () => {
  const prisma = new PrismaClient();

  async function main() {
    const role = await prisma.role.findFirst({ where: { name: "ADMIN" } });
    if (role === null) {
      await prisma.user.create({
        data: {
          ...user,
          role: {
            create: { name: "ADMIN" },
          },
          password: createHash("md5").update(user.password).digest("hex"),
        },
      });
    } else {
      await prisma.user.create({
        data: {
          ...user,
          roleId: role.id,
          password: createHash("md5").update(user.password).digest("hex"),
        },
      });
    }
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
