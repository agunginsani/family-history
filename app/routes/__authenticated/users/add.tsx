import { Form, Link } from "@remix-run/react";
import { Input, Button } from "~/components";

export async function action() {
  return null;
}

export default function Add() {
  return (
    <main className="mx-auto mb-5 max-w-lg rounded bg-white p-4 shadow">
      <h1 className="mb-3 text-2xl font-bold">Add User</h1>
      <Form className="grid gap-y-2" method="post">
        <div
          className="flex h-6 items-center font-semibold text-red-500"
          role="alert"
        ></div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="name">
            Name
          </label>
          <Input id="name" type="text" name="name" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <Input id="email" type="email" name="email" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="gender">
            Gender
          </label>
          <Input id="gender" type="text" name="gender" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="dob">
            Date of Birth
          </label>
          <Input id="dob" type="text" name="dob" required />
        </div>
        <div className="grid gap-y-1">
          <label className="text-sm" htmlFor="role">
            Role
          </label>
          <Input id="role" type="text" name="role" required />
        </div>
        <div className="flex gap-x-2">
          <Button className="mt-4">Submit</Button>
          <Link to="../users">
            <Button variant="text" className="mt-4">
              Cancel
            </Button>
          </Link>
        </div>
      </Form>
    </main>
  );
}
