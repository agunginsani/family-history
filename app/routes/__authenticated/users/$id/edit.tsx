import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { ActionResponse } from "~/components/user-form";
import { UserForm } from "~/components/user-form";
import { getRoles } from "~/model/role.server";
import { editUser, EditUserDTOSchema, getUser } from "~/model/user.server";
import { formatDate } from "~/utils/date";

export async function loader({ params }: LoaderArgs) {
  const id = z.string().uuid().parse(params.id);
  const [user, roles] = await Promise.all([getUser(id), getRoles()]);
  return { user: { ...user, dob: formatDate(user.dob, "yyyy-MM-dd") }, roles };
}

export async function action({ request }: ActionArgs): Promise<ActionResponse> {
  const formData = await request.formData();
  const dobString = z.string().parse(formData.get("dob"));
  formData.set("dob", new Date(dobString).toISOString());
  const formDataObject = EditUserDTOSchema.parse(Object.fromEntries(formData));
  try {
    await editUser(formDataObject);
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
        type: "error",
        message: "This email has been registered before!",
      };
    }
    throw error;
  }
}

export default function Edit() {
  const { user, roles } = useLoaderData<typeof loader>();
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Edit User</h1>
      <UserForm defaultValues={user} roles={roles} />
    </main>
  );
}
