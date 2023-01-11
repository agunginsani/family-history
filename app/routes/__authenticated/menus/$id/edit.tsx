import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { ActionResponse } from "~/components/menu-form";
import { MenuForm } from "~/components/menu-form";
import { editMenu, EditMenuDTOSchema, getMenu } from "~/model/menu.server";

export function loader({ params }: LoaderArgs) {
  const id = z.string().uuid().parse(params.id);
  return getMenu(id);
}

export async function action({ request }: ActionArgs): Promise<ActionResponse> {
  const formData = await request.formData();
  const formDataObject = EditMenuDTOSchema.parse(Object.fromEntries(formData));
  await editMenu(formDataObject);
  return {
    type: "success",
    message: "Update success!",
  };
}

export default function Edit() {
  const menu = useLoaderData<typeof loader>();
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Edit Menu</h1>
      <MenuForm defaultValues={menu} />
    </main>
  );
}
