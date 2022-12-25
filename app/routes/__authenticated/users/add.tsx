import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import { Input, Button } from "~/components";
import { addUser, AddUserDTOSchema } from "~/model/user.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const dobString = formData.get("dob")?.toString();
  dobString && formData.set("dob", new Date(dobString).toISOString());
  const parsedFormDataObject = AddUserDTOSchema.parse(
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
    });
}

export default function Add() {
  const transition = useTransition();
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
    <main className="mx-auto mb-5 max-w-lg rounded bg-white p-4 shadow">
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
          {response?.message}
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="name">
            Name
          </label>
          <Input id="name" type="text" name="name" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <Input id="email" type="email" name="email" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" id="gender">
            Gender
          </label>
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
          <label className="text-sm" htmlFor="dob">
            Date of Birth
          </label>
          <Input id="dob" type="date" name="dob" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="roleId"
            className="rounded border border-gray-200 p-1"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </select>
        </div>
        <div className="flex gap-x-2">
          <Button className="mt-4">
            {isAdding ? "Submitting..." : "Submit"}
          </Button>
          {!isAdding && (
            <Link to="../users">
              <Button variant="text" className="mt-4">
                Cancel
              </Button>
            </Link>
          )}
        </div>
      </Form>
    </main>
  );
}
