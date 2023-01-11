import type { ActionArgs } from "@remix-run/node";
import React from "react";
import type { ActionResponse } from "~/components/menu-form";
import { MenuForm } from "~/components/menu-form";
import { addMenu, AddMenuDTOSchema } from "~/model/menu.server";

export async function action({ request }: ActionArgs): Promise<ActionResponse> {
  const formData = await request.formData();
  const formDataObject = AddMenuDTOSchema.parse(Object.fromEntries(formData));
  const menu = await addMenu(formDataObject);
  return {
    type: "success",
    message: `${menu.name} has been added!`,
  };
}

export default function Add() {
  const formRef = React.useRef<HTMLFormElement>(null);
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add Menu</h1>
      <MenuForm ref={formRef} onSuccess={() => formRef.current?.reset()} />
    </main>
  );
}
