import { createCookie } from "@remix-run/node";
import { getAuthorizedUser } from "~/model/user.server";

export const session = {
  ...createCookie("session", {
    secure: true,
    httpOnly: true,
    expires: new Date(2147483647000), // Never expires.
  }),
  async verify(cookie: string | null) {
    const token = (await this.parse(cookie)) as string;
    return getAuthorizedUser(token);
  },
};
