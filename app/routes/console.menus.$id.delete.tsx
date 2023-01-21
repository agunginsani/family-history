import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { deleteMenu } from "~/model/menu.server";

export async function action({ params }: ActionArgs) {
  const id = z.string().uuid().parse(params.id);
  try {
    await deleteMenu(id);
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
