import { prisma } from "~/utils/db.server";
import { createHash } from "crypto";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = "123";

function hashPassword(password: string) {
  return createHash("md5").update(password).digest("hex");
}

type AddUserDTO = {
  email: string;
  name: string;
  password: string;
  roleId: number;
};

export async function addUser({ name, email, roleId, password }: AddUserDTO) {
  const user = await prisma.user.create({
    data: { name, email, roleId, password: hashPassword(password) },
  });
  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

class CredentialsError extends Error {
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

export async function getAuthorizedUser(token: string) {
  verify(token, JWT_SECRET);
  return prisma.user.findFirstOrThrow({
    where: { sessions: { some: { token } } },
  });
}
