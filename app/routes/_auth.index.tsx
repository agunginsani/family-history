import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("token")) throw redirect("/");
  return null;
}

export default function Index() {
  return <Outlet />;
}
