import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { deleteRoleMenu } from "~/model/role-menu.server";

export async function action({ params }: ActionArgs) {
  const id = z.string().uuid().parse(params.id);
  try {
    await deleteRoleMenu(id);
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
