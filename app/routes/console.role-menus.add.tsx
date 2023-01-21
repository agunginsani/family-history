import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import * as React from "react";
import type { RoleMenuFormActionData } from "~/components";
import { RoleMenuForm } from "~/components";
import { getMenus } from "~/model/menu.server";
import { addRoleMenu, AddRoleMenuDTOSchema } from "~/model/role-menu.server";
import { getRoles } from "~/model/role.server";

export async function loader() {
  return Promise.all([getMenus(), getRoles()]);
}

export async function action({
  request,
}: ActionArgs): Promise<RoleMenuFormActionData> {
  const formData = await request.formData();
  const formDataObject = AddRoleMenuDTOSchema.parse(
    Object.fromEntries(formData)
  );

  try {
    const roleMenu = await addRoleMenu(formDataObject);
    return {
      type: "success",
      message: `${roleMenu.role.name} role can access ${roleMenu.menu.name} menu now!`,
    };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        type: "success",
        message: "This rule is already exist!",
      };
    }
    console.error(error);
    throw error;
  }
}

export default function Index() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [menus, roles] = useLoaderData<typeof loader>();
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add Role Menu</h1>
      <RoleMenuForm
        ref={formRef}
        menus={menus}
        roles={roles}
        onSuccess={() => formRef.current?.reset()}
      />
    </main>
  );
}
