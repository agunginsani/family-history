import clsx from "clsx";
import * as React from "react";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithRef<"select">
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={clsx("rounded border border-gray-200 p-1", className)}
      {...props}
    />
  );
});

Select.displayName = "Select";
