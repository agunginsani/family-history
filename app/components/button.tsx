import { clsx } from "clsx";
import * as React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<"button">
>(({ className, ...props }, ref) => {
  return (
    <button
      className={clsx(
        "rounded bg-blue-900 p-1 text-white disabled:bg-gray-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export default Button;
