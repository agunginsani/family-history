import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.create({
    data: { name: "ADMIN" },
  });
  const menuMenu = await prisma.menu.create({
    data: { name: "Menu", path: "menus" },
  });
  const roleMenuMenu = await prisma.menu.create({
    data: { name: "Role Menu", path: "role-menus" },
  });
  const userMenu = await prisma.menu.create({
    data: { name: "User", path: "users" },
  });
  const sessionMenu = await prisma.menu.create({
    data: { name: "Session", path: "sessions" },
  });
  await prisma.roleMenu.createMany({
    data: [
      { menuId: menuMenu.id, roleId: adminRole.id },
      { menuId: roleMenuMenu.id, roleId: adminRole.id },
      { menuId: userMenu.id, roleId: adminRole.id },
      { menuId: sessionMenu.id, roleId: adminRole.id },
    ],
  });
  await prisma.user.create({
    data: {
      email: "admin@test.com",
      name: "Admin",
      dob: faker.date.birthdate().toISOString(),
      gender: "male",
      password: createHash("md5").update("admin").digest("hex"),
      roleId: adminRole.id,
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
