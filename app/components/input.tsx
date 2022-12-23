import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<"input">
>((props, ref) => {
  return (
    <input
      ref={ref}
      className="rounded border border-gray-200 p-1"
      {...props}
    />
  );
});

Input.displayName = "Input";
