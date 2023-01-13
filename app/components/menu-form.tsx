import type { Menu } from "@prisma/client";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import * as React from "react";
import { Alert } from "./alert";
import { Button } from "./button";
import { FadeTransition } from "./fade-transition";
import { Input } from "./input";
import { Label } from "./label";

export type MenuFormActionResponse = {
  type: "error" | "success";
  message: string;
};

type MenuFormProps = {
  defaultValues?: Menu;
  onSuccess?: () => void;
};

export const MenuForm = React.forwardRef<HTMLFormElement, MenuFormProps>(
  function MenuForm({ defaultValues, onSuccess }, ref) {
    const inputNameRef = React.useRef<HTMLInputElement>(null);
    const onSuccessRef = React.useRef(onSuccess);
    const navigation = useNavigation();
    const actionData = useActionData<MenuFormActionResponse>();
    const isBusy = navigation.state === "submitting";

    React.useEffect(() => {
      if (actionData?.type === "success" && !isBusy) {
        inputNameRef.current?.focus();
        onSuccessRef.current?.();
      }
    }, [isBusy, actionData?.type]);

    return (
      <>
        <FadeTransition show={actionData && !isBusy}>
          <Alert type={actionData?.type}>{actionData?.message}</Alert>
        </FadeTransition>
        <Form ref={ref} className="grid gap-y-2" method="post">
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
);
