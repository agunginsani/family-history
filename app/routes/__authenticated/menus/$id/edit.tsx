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
import * as React from "react";
import { Input, Button } from "~/components";
import { editMenu, EditMenuDTOSchema, getMenu } from "~/model/menu.server";

export async function loader({ params }: LoaderArgs) {
  if (params.id === undefined) throw new Error("ID cannot be empty!");
  return getMenu(params.id);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const parsedFormDataObject = EditMenuDTOSchema.parse(
    Object.fromEntries(formData)
  );
  return editMenu(parsedFormDataObject)
    .then(() => ({
      type: "success" as const,
      message: `Update success!`,
    }))
    .catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        const message = "Something went wrong!";
        return {
          type: "error" as const,
          message,
        };
      }
      console.error(error);
      return null;
    });
}

function Label(props: React.ComponentPropsWithoutRef<"label">) {
  return <label className="w-min whitespace-nowrap text-sm" {...props} />;
}

export default function Edit() {
  const transition = useTransition();
  const response = useActionData<typeof action>();
  const menu = useLoaderData<typeof loader>();
  const inputNameRef = React.useRef<HTMLInputElement>(null);
  const isEditing =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "edit menu";

  React.useEffect(() => {
    if (response?.type === "success" && !isEditing) {
      inputNameRef.current?.focus();
    }
  }, [isEditing, response?.type]);

  return (
    <main className="mb-3 rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Edit Menu</h1>
      <div
        className={clsx("mb-3 flex h-6 items-center font-semibold", {
          "text-green-500": response?.type === "success",
          "text-red-500": response?.type === "error",
        })}
        role="alert"
      >
        {!isEditing && response?.message}
      </div>
      <Form className="grid gap-y-2" method="post">
        <input type="hidden" name="id" defaultValue={menu.id} />
        <div className="grid gap-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            ref={inputNameRef}
            id="name"
            type="text"
            name="name"
            defaultValue={menu.name}
            required
          />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="email">Path</Label>
          <Input
            id="email"
            type="text"
            name="path"
            defaultValue={menu.path}
            required
          />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button value="edit menu" name="_action">
            {isEditing ? "Submitting..." : "Submit"}
          </Button>
          {!isEditing && (
            <Link to="../menus">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </main>
  );
}
