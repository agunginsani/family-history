import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { z } from "zod";
import type { UserFormActionResponse } from "~/components";
import { UserForm } from "~/components";
import { getRoles } from "~/model/role.server";
import { AddUserDTOSchema, addUser } from "~/model/user.server";

export function loader() {
  return getRoles();
}

export async function action({
  request,
}: ActionArgs): Promise<UserFormActionResponse> {
  const formData = await request.formData();
  const dobString = z.string().parse(formData.get("dob"));
  formData.set("dob", new Date(dobString).toISOString());
  const formDataObject = AddUserDTOSchema.parse(Object.fromEntries(formData));
  try {
    const user = await addUser(formDataObject);
    return {
      type: "success",
      message: `${user.name} has been added!`,
    };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        type: "error",
        message: "This email has been registered before!",
      };
    }
    console.error(error);
    throw error;
  }
}

export default function Add() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const roles = useLoaderData<typeof loader>();
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add User</h1>
      <UserForm
        ref={formRef}
        roles={roles}
        onSuccess={() => formRef.current?.reset()}
      />
    </main>
  );
}
