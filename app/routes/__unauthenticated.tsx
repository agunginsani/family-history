import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { session } from "~/utils/cookies.server";

export async function loader({ request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const token = await session.parse(cookie);
  if (token) return redirect("/");
  return null;
}

export default function Index() {
  return <Outlet />;
}
