import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { deleteUser } from "~/model/user.server";

export async function action({ params }: ActionArgs) {
  const id = z.string().uuid().parse(params.id);
  try {
    await deleteUser(id);
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
