import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { MenuFormActionResponse } from "~/components";
import { MenuForm } from "~/components";
import { editMenu, EditMenuDTOSchema, getMenu } from "~/model/menu.server";

export function loader({ params }: LoaderArgs) {
  const id = z.string().uuid().parse(params.id);
  return getMenu(id);
}

export async function action({
  request,
}: ActionArgs): Promise<MenuFormActionResponse> {
  const formData = await request.formData();
  const formDataObject = EditMenuDTOSchema.parse(Object.fromEntries(formData));
  try {
    await editMenu(formDataObject);
    return {
      type: "success",
      message: "Update success!",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function Index() {
  const menu = useLoaderData<typeof loader>();
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Edit Menu</h1>
      <MenuForm defaultValues={menu} />
    </main>
  );
}
