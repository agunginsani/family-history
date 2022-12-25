import { clsx } from "clsx";
import * as React from "react";

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "text";
  color?: "danger" | "primary";
  size?: "small" | "medium";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      color = "primary",
      variant = "primary",
      size = "medium",
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          "rounded py-2 px-3 disabled:bg-gray-500 disabled:text-white",
          {
            "text-sm": size === "small",
            "bg-blue-700 text-white hover:bg-blue-900":
              variant === "primary" && color === "primary",
            "bg-transparent text-blue-700 hover:bg-blue-50":
              variant === "text" && color === "primary",
            "bg-red-700 text-white hover:bg-red-900":
              variant === "primary" && color === "danger",
            "bg-transparent text-red-700 hover:bg-red-50":
              variant === "text" && color === "danger",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
