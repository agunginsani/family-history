import { prisma } from '~/db.server';

type User = {
  name: string;
  email: string;
  roleId: number;
};

export async function create({ name, email, roleId }: User) {
  const user = await prisma.user.create({ data: { name, email, roleId } });
  return user;
}
