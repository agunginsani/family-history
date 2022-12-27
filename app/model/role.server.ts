import { prisma } from "~/utils/db.server";

export async function getRoles() {
  const roles = await prisma.role.findMany();
  return roles;
}
