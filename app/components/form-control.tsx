import React from "react";

export function FormControl({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className="grid gap-y-1" {...props} />;
}
