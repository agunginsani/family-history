import { ActionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { z } from "zod";
import Button from "~/components/button";
import Input from "~/components/input";
import { session } from "~/utils/cookies.server";
import { login } from "~/model/user.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = z.string().email().parse(formData.get("email"));
  const password = z.string().parse(formData.get("password"));
  try {
    const data = await login({ email, password });
    return redirect("/", {
      headers: {
        "Set-Cookie": await session.cookie.serialize(data.token),
      },
    });
  } catch (error) {
    let message = "Something went wrong!";
    if (error instanceof Error) message = error.message;
    return { message };
  }
}

export default function Login() {
  const data = useActionData<ReturnType<typeof action>>();
  const transition = useTransition();
  const error =
    data &&
    "message" in data &&
    transition.state !== "submitting" &&
    data.message;
  return (
    <div className="grid h-screen place-content-center">
      <div className="w-80 rounded bg-white p-4 shadow">
        <h1 className="mb-3 text-2xl">Who are you?</h1>
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
            <Input id="email" type="email" name="email" />
          </div>
          <div className="grid gap-y-1">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" name="password" />
          </div>
          <Button className="mt-4 w-full">
            {transition.state === "submitting" ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
