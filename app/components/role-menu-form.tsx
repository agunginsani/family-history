import type { Menu, Role, RoleMenu } from "@prisma/client";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import * as React from "react";
import { Alert } from "./alert";
import { Button } from "./button";
import { Label } from "./label";
import { Select } from "./select";

export type RoleMenuFormActionData = {
  type: "success" | "error";
  message: string;
};

type RoleMenuFormProps = {
  defaultValues?: RoleMenu & { menu: Menu; role: Role };
  menus: Array<Menu>;
  roles: Array<Role>;
  onSuccess?: () => void;
};

export const RoleMenuForm = React.forwardRef<
  HTMLFormElement,
  RoleMenuFormProps
>(function RoleMenuForm({ defaultValues, menus, roles, onSuccess }, ref) {
  const navigation = useNavigation();
  const actionData = useActionData<RoleMenuFormActionData>();
  const inputRoleRef = React.useRef<HTMLInputElement>(null);
  const onSuccessRef = React.useRef(onSuccess);
  const isBusy = navigation.state === "submitting";

  React.useEffect(() => {
    if (actionData?.type === "success" && !isBusy) {
      inputRoleRef.current?.focus();
      onSuccessRef.current?.();
    }
  }, [isBusy, actionData?.type]);

  return (
    <>
      {actionData && !isBusy && (
        <Alert type={actionData?.type}>{actionData?.message}</Alert>
      )}

      <Form ref={ref} className="grid gap-y-2" method="post">
        <input type="hidden" name="id" value={defaultValues?.id} />
        <div className="grid gap-y-1">
          <Label htmlFor="role">Role</Label>
          <Select
            ref={inputRoleRef}
            options={roles}
            id="role"
            name="roleId"
            defaultValue={defaultValues?.role}
            required
          />
        </div>
        <div className="grid gap-y-1">
          <Label htmlFor="menu">Menu</Label>
          <Select
            options={menus}
            id="menu"
            name="menuId"
            defaultValue={defaultValues?.menu}
            required
          />
        </div>
        <div className="mt-4 flex gap-x-2">
          <Button value="add role menu" name="_action">
            {isBusy ? "Submitting..." : "Submit"}
          </Button>
          {!isBusy && (
            <Link to="../role-menus">
              <Button variant="text">Cancel</Button>
            </Link>
          )}
        </div>
      </Form>
    </>
  );
});
