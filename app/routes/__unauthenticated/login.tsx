import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { z } from "zod";
import { Button, Input } from "~/components";
import { CredentialsError, login } from "~/model/user.server";
import uaParser from "ua-parser-js";
import { commitSession, getSession } from "~/utils/session.server";

function formatUserAgent(
  general: string | undefined,
  detail: string | undefined
) {
  const result = `${general ?? ""} (${detail ?? ""})`
    .replace(/\(\)/, "")
    .trim();
  if (result === "") return "Unknown";
  return result;
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("token")) {
    throw redirect("/");
  }

  const data = { error: session.get("error") as string };
  return json(data);
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const email = z.string().email().parse(formData.get("email"));
  const password = z.string().parse(formData.get("password"));
  const ua = uaParser(request.headers.get("user-agent") ?? undefined);

  try {
    const data = await login({
      email,
      password,
      browser: formatUserAgent(ua.browser.name, ua.browser.version),
      os: formatUserAgent(ua.os.name, ua.os.version),
      device: formatUserAgent(ua.device.vendor, ua.device.model),
    });
    session.set("token", data.token);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    let message = "Something went wrong!";

    if (error instanceof CredentialsError) message = error.message;
    else console.error(error);

    session.flash("error", message);

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();
  const transition = useTransition();
  return (
    <div className="grid h-screen place-content-center">
      <main className="w-80 rounded bg-white p-4 shadow">
        <span className="mb-3 text-2xl font-bold">Who are you?</span>
        <Form className="grid gap-y-2" method="post">
          <div
            className="flex h-6 items-center font-semibold text-red-500"
            role="alert"
          >
            {error}
          </div>
          <div className="grid gap-y-1">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" name="email" required />
          </div>
          <div className="grid gap-y-1">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button className="mt-4 w-full">
            {transition.state === "submitting" ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </main>
    </div>
  );
}
