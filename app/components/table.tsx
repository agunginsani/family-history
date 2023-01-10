import clsx from "clsx";
import React from "react";

export function Table({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <table
      className={clsx("w-full border-collapse border", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  return <th className={clsx("border p-2", className)} {...props} />;
}

export function TableCell({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  return <td className={clsx("border p-2", className)} {...props} />;
}
