import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { deleteSession } from "~/model/session.server";

export async function action({ params }: ActionArgs) {
  const token = z.string().parse(params.token);
  try {
    await deleteSession(token);
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
