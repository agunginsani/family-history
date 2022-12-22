import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Outlet, useTransition } from "@remix-run/react";
import Button from "~/components/button";
import { session } from "~/utils/cookies.server";

export async function loader({ request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  try {
    return await session.verify(cookie);
  } catch (error) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await session.serialize("", { expires: new Date() }),
      },
    });
  }
}

export default function Index() {
  const transition = useTransition();
  return (
    <div>
      <header className="flex h-16 items-center justify-between bg-white px-3 shadow-md">
        <span className="mb-3 text-2xl font-bold">Family History</span>
        <Form action="/logout" method="post">
          <Button variant="text" size="small" name="_action" value="logout">
            {transition.state === "submitting" &&
            transition.submission.formData.get("_action") === "logout"
              ? "Logging out..."
              : "Log out"}
          </Button>
        </Form>
      </header>
      <div className="mt-5 px-3">
        <Outlet />
      </div>
    </div>
  );
}
