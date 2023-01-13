import clsx from "clsx";
import React from "react";

type AlertProps = Omit<React.ComponentPropsWithoutRef<"div">, "role"> & {
  type?: "success" | "error";
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert({ className, type = "error", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex h-6 items-center rounded px-2 text-sm",
          {
            "bg-green-500 text-white": type === "success",
            "bg-red-500 text-white": type === "error",
          },
          className
        )}
        role="alert"
        {...props}
      />
    );
  }
);
