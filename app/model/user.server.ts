import { prisma } from "~/utils/db.server";
import { createHash } from "crypto";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = "123";

function hashPassword(password: string) {
  return createHash("md5").update(password).digest("hex");
}

export const AddUserDTOSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  roleId: z.string(),
  dob: z.string().datetime(),
  gender: z.union([z.literal("male"), z.literal("female")]),
});

export type AddUserDTO = z.infer<typeof AddUserDTOSchema>;

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

export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
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
};

export async function login(payload: LoginDTO) {
  const token = sign(payload, JWT_SECRET);
  const { id: userId, password } = await prisma.user
    .findFirstOrThrow({
      where: { email: payload.email },
    })
    .catch(() => {
      throw new CredentialsError();
    });
  if (hashPassword(payload.password) !== password) {
    throw new CredentialsError();
  }
  return prisma.session.create({ data: { token, userId } });
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
