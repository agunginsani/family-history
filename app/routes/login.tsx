import { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Button from "~/components/button";
import Input from "~/components/input";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  console.table(Object.fromEntries(formData));
  return null;
}

export default function Login() {
  return (
    <div className="grid h-screen place-content-center">
      <div className="w-80 rounded bg-white p-4 shadow">
        <h1 className="mb-5 text-2xl">Who are you?</h1>
        <Form className="grid gap-y-2" method="post">
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
          <Button className="mt-4 w-full">Submit</Button>
        </Form>
      </div>
    </div>
  );
}
