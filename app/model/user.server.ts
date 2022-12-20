import { z } from 'zod';
import { prisma } from '~/db.server';

const User = z.object({
  name: z.string(),
  email: z.string().email(),
  roleId: z.number(),
});

type User = z.infer<typeof User>;

export async function create({ name, email, roleId }: User) {
  await prisma.user.create({ data: { name, email, roleId } });
}
