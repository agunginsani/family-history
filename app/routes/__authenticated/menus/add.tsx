import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import clsx from "clsx";
import * as React from "react";
import { Input, Button } from "~/components";
import { addMenu, AddMenuDTOSchema } from "~/model/menu.server";

export async function loader() {
  return null;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const parsedFormDataObject = AddMenuDTOSchema.parse(
    Object.fromEntries(formData)
  );
  return addMenu(parsedFormDataObject)
    .then((menu) => ({
      type: "success" as const,
      message: `${menu.name} has been added!`,
    }))
    .catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        const message = "Something went wrong!";
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
  const response = useActionData<typeof action>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputNameRef = React.useRef<HTMLInputElement>(null);
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "add menu";

  React.useEffect(() => {
    if (response?.type === "success" && !isAdding) {
      formRef.current?.reset();
      inputNameRef.current?.focus();
    }
  }, [isAdding, response?.type]);

  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add Menu</h1>
      <Form ref={formRef} className="grid gap-y-2" method="post">
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
          <Input
            ref={inputNameRef}
            id="name"
            type="text"
            name="name"
            required
          />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="email">Path</Label>
          <Input id="email" type="text" name="path" required />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button value="add menu" name="_action">
            {isAdding ? "Submitting..." : "Submit"}
          </Button>
          {!isAdding && (
            <Link to="../menus">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </main>
  );
}
