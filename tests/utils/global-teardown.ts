import { PrismaClient } from "@prisma/client";
import { user } from "./global-setup";

export default async () => {
  const prisma = new PrismaClient();

  async function main() {
    await prisma.session.deleteMany({ where: { email: user.email } });
    await prisma.user.delete({ where: { email: user.email } });
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
