import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import clsx from "clsx";
import * as React from "react";
import { Input, Button, Select, SelectOptionsSchema } from "~/components";
import { getRoles } from "~/model/role.server";
import { AddOrEditUserDTOSchema, addUser } from "~/model/user.server";

export async function loader() {
  return getRoles();
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const dobString = formData.get("dob")?.toString();
  dobString && formData.set("dob", new Date(dobString).toISOString());
  const parsedFormDataObject = AddOrEditUserDTOSchema.parse(
    Object.fromEntries(formData)
  );
  return addUser(parsedFormDataObject)
    .then((user) => ({
      type: "success" as const,
      message: `${user.email} has been added!`,
    }))
    .catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        const message =
          error.code === "P2002"
            ? "This email has been registered before!"
            : "Something went wrong!";
        return {
          type: "error" as const,
          message,
        };
      }
      console.error(error);
      return null;
    });
}

function Label(props: React.ComponentPropsWithoutRef<"label">) {
  return <label className="w-min whitespace-nowrap text-sm" {...props} />;
}

export default function Add() {
  const transition = useTransition();
  const roles = useLoaderData<ReturnType<typeof loader>>();
  const response = useActionData<ReturnType<typeof action>>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "add user";

  React.useEffect(() => {
    if (response?.type === "success") {
      formRef.current?.reset();
    }
  }, [response?.type]);

  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add User</h1>
      <Form ref={formRef} className="grid gap-y-2" method="post">
        <input type="hidden" name="_action" value="add user" />
        <div
          className={clsx("flex h-6 items-center font-semibold", {
            "text-green-500": response?.type === "success",
            "text-red-500": response?.type === "error",
          })}
          role="alert"
        >
          {!isAdding && response?.message}
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" name="name" required />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" required />
        </div>

        <div className="grid gap-y-1">
          <Label id="gender">Gender</Label>
          <div
            aria-labelledby="gender"
            className="flex gap-x-3"
            role="radiogroup"
          >
            <span>
              <Input
                id="gender-male"
                type="radio"
                value="male"
                name="gender"
                defaultChecked
              />
              <label className="ml-2" htmlFor="gender-male">
                Male
              </label>
            </span>
            <span>
              <Input
                id="gender-female"
                type="radio"
                value="female"
                name="gender"
              />
              <label className="ml-2" htmlFor="gender-female">
                Female
              </label>
            </span>
          </div>
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" name="dob" required />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            name="roleId"
            options={SelectOptionsSchema.parse(roles)}
            required
          />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button>{isAdding ? "Submitting..." : "Submit"}</Button>
          {!isAdding && (
            <Link to="../users">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </main>
  );
}
