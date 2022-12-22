import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { session } from "~/utils/cookies.server";

export async function loader({ request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  try {
    return await session.verify(cookie);
  } catch (error) {
    return redirect("/login");
  }
}

export default function Index() {
  return <Outlet />;
}
