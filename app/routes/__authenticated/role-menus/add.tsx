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
import { Button, Select } from "~/components";
import { getMenus } from "~/model/menu.server";
import { addRoleMenu, AddRoleMenuDTOSchema } from "~/model/role-menu.server";
import { getRoles } from "~/model/role.server";

export async function loader() {
  return Promise.all([getMenus(), getRoles()]);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const parsedFormDataObject = AddRoleMenuDTOSchema.parse(
    Object.fromEntries(formData)
  );

  return addRoleMenu(parsedFormDataObject)
    .then((roleMenu) => ({
      type: "success" as const,
      message: `${roleMenu.role.name} can access ${roleMenu.menu.name}`!,
    }))
    .catch((error) => {
      let message = "Something went wrong!";

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        message = "This rule is already exist!";
      } else {
        console.error(error);
      }

      return {
        type: "error" as const,
        message,
      };
    });
}

function Label(props: React.ComponentPropsWithoutRef<"label">) {
  return <label className="w-min whitespace-nowrap text-sm" {...props} />;
}

export default function Add() {
  const transition = useTransition();
  const response = useActionData<typeof action>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRoleRef = React.useRef<HTMLInputElement>(null);
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "add role menu";
  const [menus, roles] = useLoaderData<typeof loader>();

  React.useEffect(() => {
    if (response?.type === "success" && !isAdding) {
      formRef.current?.reset();
      inputRoleRef.current?.focus();
    }
  }, [isAdding, response?.type]);

  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add Role Menu</h1>
      <div
        className={clsx("mb-3 flex h-6 items-center font-semibold", {
          "text-green-500": response?.type === "success",
          "text-red-500": response?.type === "error",
        })}
        role="alert"
      >
        {!isAdding && response?.message}
      </div>
      <Form ref={formRef} className="grid gap-y-2" method="post">
        <div className="grid gap-y-1">
          <Label htmlFor="role">Role</Label>
          <Select
            ref={inputRoleRef}
            options={roles}
            id="role"
            name="roleId"
            required
          />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="menu">Menu</Label>
          <Select options={menus} id="menu" name="menuId" required />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button value="add role menu" name="_action">
            {isAdding ? "Submitting..." : "Submit"}
          </Button>
          {!isAdding && (
            <Link to="../role-menus">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </main>
  );
}
