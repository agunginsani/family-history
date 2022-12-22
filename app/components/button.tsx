import { clsx } from "clsx";
import * as React from "react";

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "text";
  size?: "small" | "medium";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "medium", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "rounded py-2 px-3 disabled:bg-gray-500 disabled:text-white",
          {
            "text-sm": size === "small",
            "bg-blue-700 text-white hover:bg-blue-900": variant === "primary",
            "bg-transparent text-blue-700 hover:bg-blue-50": variant === "text",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Button;
