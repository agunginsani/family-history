import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import clsx from "clsx";
import { formatInTimeZone } from "date-fns-tz";
import * as React from "react";
import {
  Input,
  Button,
  Select,
  SelectValueSchema,
  SelectOptionsSchema,
} from "~/components";
import { getRoles } from "~/model/role.server";
import { editUser, EditUserDTOSchema, getUser } from "~/model/user.server";

export async function loader({ params }: LoaderArgs) {
  if (params.userId === undefined) throw new Error("User ID cannot be empty!");
  return Promise.all([
    getUser(params.userId).then((user) => ({
      ...user,
      dob: formatInTimeZone(user.dob, "Asia/Jakarta", "yyyy-MM-dd"),
    })),
    getRoles(),
  ]);
}

export async function action({ request, params }: ActionArgs) {
  if (params.userId === undefined) throw new Error("User ID cannot be empty!");
  const formData = await request.formData();
  const dobString = formData.get("dob")?.toString();
  dobString && formData.set("dob", new Date(dobString).toISOString());
  const parsedFormDataObject = EditUserDTOSchema.parse(
    Object.fromEntries(formData)
  );
  return editUser(params.userId, parsedFormDataObject)
    .then((user) => ({
      type: "success" as const,
      message: `${user.email} has been updated!`,
    }))
    .catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        const message =
          error.code === "P2002"
            ? "This email has been registered before!"
            : "Something went wrong!";
        return {
          type: "error" as const,
          message,
        };
      }
    });
}

export default function Edit() {
  const transition = useTransition();
  const [user, roles] = useLoaderData<typeof loader>();
  const response = useActionData<typeof action>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const isEditing =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "edit user";
  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Edit User</h1>
      <Form ref={formRef} className="grid gap-y-2" method="post">
        <input type="hidden" name="_action" value="edit user" />
        <div
          className={clsx("flex h-6 items-center font-semibold", {
            "text-green-500": response?.type === "success",
            "text-red-500": response?.type === "error",
          })}
          role="alert"
        >
          {!isEditing && response?.message}
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            type="text"
            defaultValue={user.name}
            name="name"
            required
          />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            defaultValue={user.email}
            type="email"
            name="email"
            required
          />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" id="gender">
            Gender
          </label>
          <div
            aria-labelledby="gender"
            className="flex gap-x-3"
            role="radiogroup"
          >
            <span>
              <Input
                id="gender-male"
                type="radio"
                value="male"
                name="gender"
                defaultChecked={user.gender === "male"}
              />
              <label className="ml-2" htmlFor="gender-male">
                Male
              </label>
            </span>
            <span>
              <Input
                id="gender-female"
                type="radio"
                value="female"
                name="gender"
                defaultChecked={user.gender === "female"}
              />
              <label className="ml-2" htmlFor="gender-female">
                Female
              </label>
            </span>
          </div>
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="dob">
            Date of Birth
          </label>
          <Input
            id="dob"
            type="date"
            defaultValue={user.dob}
            name="dob"
            required
          />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="role">
            Role
          </label>
          <Select
            id="role"
            name="roleId"
            options={SelectOptionsSchema.parse(roles)}
            defaultValue={SelectValueSchema.parse(user.role)}
            required
          />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button>{isEditing ? "Submitting..." : "Submit"}</Button>
          {!isEditing && (
            <Link to="../users">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </main>
  );
}
