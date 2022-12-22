import { ActionArgs, redirect } from "@remix-run/node";
import { logout } from "~/model/user.server";
import { session } from "~/utils/cookies.server";

export async function action({ request }: ActionArgs) {
  const cookie = request.headers.get("Cookie");
  const formData = await request.formData();
  if (formData.get("_action") === "logout") {
    const token = await session.parse(cookie);
    await logout(token);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await session.serialize("", { expires: new Date() }),
      },
    });
  }
}
