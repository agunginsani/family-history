import type { Menu } from "@prisma/client";
import type { FormProps } from "@remix-run/react";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export type ActionResponse = {
  type: string;
  message: string;
};

type MenuFormProps = {
  defaultValues?: Menu;
  method: FormProps["method"];
};

export function MenuForm({ defaultValues, method }: MenuFormProps) {
  const navigation = useNavigation();
  const response = useActionData<ActionResponse>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputNameRef = React.useRef<HTMLInputElement>(null);
  const isBusy = navigation.state === "submitting";

  React.useEffect(() => {
    if (response?.type === "success" && !isBusy) {
      method === "post" && formRef.current?.reset();
      inputNameRef.current?.focus();
    }
  }, [isBusy, method, response?.type]);

  return (
    <>
      <div
        className={clsx("mb-3 flex h-6 items-center font-semibold", {
          "text-green-500": response?.type === "success",
          "text-red-500": response?.type === "error",
        })}
        role="alert"
      >
        {!isBusy && response?.message}
      </div>
      <Form ref={formRef} className="grid gap-y-2" method={method}>
        <input type="hidden" name="id" value={defaultValues?.id} />
        <div className="grid gap-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            ref={inputNameRef}
            id="name"
            type="text"
            name="name"
            defaultValue={defaultValues?.name}
            required
          />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="email">Path</Label>
          <Input
            id="email"
            type="text"
            name="path"
            defaultValue={defaultValues?.path}
            required
          />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button>{isBusy ? "Submitting..." : "Submit"}</Button>
          {!isBusy && (
            <Link to="../menus">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </>
  );
}
