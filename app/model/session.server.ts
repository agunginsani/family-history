import { prisma } from "~/utils/db.server";

export async function getSessions() {
  const sessions = await prisma.session.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return sessions;
}

export async function deleteSession(token: string) {
  const session = prisma.session.delete({
    where: { token },
  });
  return session;
}
