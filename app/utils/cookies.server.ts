import { createCookie, redirect } from "@remix-run/node";
import { getAuthorizedUser } from "~/model/user.server";

export const session = {
  cookie: createCookie("session", {
    secure: true,
    httpOnly: true,
  }),
  async verify(cookie: string | null) {
    const token = (await this.cookie.parse(cookie)) as string;
    return getAuthorizedUser(token);
  },
};
