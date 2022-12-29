import { prisma } from "~/utils/db.server";

export async function getSessions() {
  const sessions = await prisma.session.findMany({ include: { user: true } });
  return sessions;
}

export async function deleteSession(id: string) {
  const session = prisma.session.delete({
    where: { id: Number(id) },
  });
  return session;
}
