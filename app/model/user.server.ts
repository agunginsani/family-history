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

export function addUser(payload: AddUserDTO) {
  return prisma.user.create({
    data: {
      password: hashPassword("P@ssw0rd"),
      ...payload,
    },
  });
}
export function editUser(id: string, payload: AddUserDTO) {
  return prisma.user.update({
    where: { id },
    data: payload,
  });
}

export function getUser(id: string) {
  return prisma.user.findFirstOrThrow({
    where: { id },
    include: { role: true },
  });
}

export function getUsers() {
  return prisma.user.findMany({ orderBy: { id: "asc" } });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
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
    data: { token, email, ...ua },
  });
}

export function logout(token: string) {
  return prisma.session.delete({ where: { token } });
}

export function getAuthorizedUser(token: string) {
  verify(token, JWT_SECRET);
  return prisma.user.findFirstOrThrow({
    where: { sessions: { some: { token } } },
  });
}
