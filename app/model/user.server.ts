import { prisma } from "~/utils/db.server";
import { createHash } from "crypto";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = "123";

function hashPassword(password: string) {
  return createHash("md5").update(password).digest("hex");
}

export const AddOrEditUserDTOSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  roleId: z.string(),
  dob: z.string().datetime(),
  gender: z.union([z.literal("male"), z.literal("female")]),
});

export type AddUserDTO = z.infer<typeof AddOrEditUserDTOSchema>;

export async function addUser({ roleId, ...payload }: AddUserDTO) {
  const user = await prisma.user.create({
    data: {
      roleId: Number(roleId),
      password: hashPassword("P@ssw0rd"),
      ...payload,
    },
  });
  return user;
}
export async function editUser(id: string, { roleId, ...payload }: AddUserDTO) {
  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      roleId: Number(roleId),
      ...payload,
    },
  });
  return user;
}

export async function getUser(id: string) {
  const users = await prisma.user.findFirstOrThrow({
    where: { id: Number(id) },
    include: { role: true },
  });
  return users;
}

export async function getUsers() {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  return users;
}

export async function deleteUser(id: string) {
  const user = prisma.user.delete({ where: { id: Number(id) } });
  return user;
}

export class CredentialsError extends Error {
  constructor() {
    super();
    this.name = "CredentialsError";
    this.message = "Invalid credentials!";
  }
}

type LoginDTO = {
  email: string;
  password: string;
  browser: string;
  os: string;
  device: string;
};

export async function login({ email, password, ...ua }: LoginDTO) {
  const token = sign({ email, password }, JWT_SECRET);
  const user = await prisma.user
    .findFirstOrThrow({
      where: { email },
    })
    .catch(() => {
      throw new CredentialsError();
    });
  if (hashPassword(password) !== user.password) {
    throw new CredentialsError();
  }
  return prisma.session.create({
    data: { token, userId: user.id, ...ua },
  });
}

export async function logout(token: string) {
  return prisma.session.delete({ where: { token } });
}

export async function getAuthorizedUser(token: string) {
  verify(token, JWT_SECRET);
  return prisma.user.findFirstOrThrow({
    where: { sessions: { some: { token } } },
  });
}
