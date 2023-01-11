import type { Role, User } from "@prisma/client";
import type { FormProps } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { Form, Link } from "@remix-run/react";
import clsx from "clsx";
import * as React from "react";
import { Button } from "./button";
import { FormControl } from "./form-control";
import { Input } from "./input";
import { Label } from "./label";
import { Select } from "./select";

type UserFormProps = {
  defaultValues?: Omit<User, "dob"> & { dob: string } & { role: Role };
  method: FormProps["method"];
  roles: Array<Role>;
};

export type ActionResponse = {
  type: "success" | "error";
  message: string;
};

export function UserForm({ defaultValues, method, roles }: UserFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputNameRef = React.useRef<HTMLInputElement>(null);
  const response = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isBusy = navigation.state === "submitting";
  const gender = defaultValues?.gender ?? "male";

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
        <input type="hidden" name="id" defaultValue={defaultValues?.id} />
        <FormControl>
          <Label htmlFor="name">Name</Label>
          <Input
            ref={inputNameRef}
            id="name"
            type="text"
            defaultValue={defaultValues?.name}
            name="name"
            required
          />
        </FormControl>
        <FormControl>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            defaultValue={defaultValues?.email}
            type="email"
            name="email"
            required
          />
        </FormControl>
        <FormControl>
          <Label id="gender">Gender</Label>
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
                defaultChecked={gender === "male"}
              />
              <Label className="ml-2" htmlFor="gender-male">
                Male
              </Label>
            </span>
            <span>
              <Input
                id="gender-female"
                type="radio"
                value="female"
                name="gender"
                defaultChecked={gender === "female"}
              />
              <Label className="ml-2" htmlFor="gender-female">
                Female
              </Label>
            </span>
          </div>
        </FormControl>
        <FormControl>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            defaultValue={defaultValues?.dob}
            name="dob"
            required
          />
        </FormControl>
        <FormControl>
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            name="roleId"
            options={roles}
            defaultValue={defaultValues?.role}
            required
          />
        </FormControl>
        <div className="mt-4 flex gap-x-2">
          <Button>{isBusy ? "Submitting..." : "Submit"}</Button>
          {!isBusy && (
            <Link to="../users">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </>
  );
}
