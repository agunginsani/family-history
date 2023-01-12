import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { RoleMenuFormActionData } from "~/components";
import { RoleMenuForm } from "~/components";
import { getMenus } from "~/model/menu.server";
import {
  editRoleMenu,
  EditRoleMenuDTOSchema,
  getRoleMenu,
} from "~/model/role-menu.server";
import { getRoles } from "~/model/role.server";

export async function loader({ params }: LoaderArgs) {
  const id = z.string().uuid().parse(params.id);
  const [roleMenu, menus, roles] = await Promise.all([
    getRoleMenu(id),
    getMenus(),
    getRoles(),
  ]);
  return { roleMenu, menus, roles };
}

export async function action({
  request,
}: ActionArgs): Promise<RoleMenuFormActionData> {
  const formData = await request.formData();
  const formDataObject = EditRoleMenuDTOSchema.parse(
    Object.fromEntries(formData)
  );

  try {
    await editRoleMenu(formDataObject);
    return {
      type: "success",
      message: "Update success!",
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

export default function Edit() {
  const { roleMenu, menus, roles } = useLoaderData<typeof loader>();
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Edit Role Menu</h1>
      <RoleMenuForm defaultValues={roleMenu} menus={menus} roles={roles} />
    </main>
  );
}
