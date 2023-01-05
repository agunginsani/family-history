import { createCookieSessionStorage } from "@remix-run/node";

if (process.env.COOKIE_SECRET === undefined) {
  throw new Error("Missing `COOKIE_SECRET`");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "_session",
      httpOnly: true,
      maxAge: 3.156e7,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.COOKIE_SECRET],
      secure: true,
    },
  });
