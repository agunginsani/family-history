import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { Button, Table, TableCell, TableHead } from "~/components";
import { deleteUser, getUsers } from "~/model/user.server";

export async function loader() {
  const users = await getUsers();
  return users;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const userId = formData.get("id")?.toString();
  if (!userId) throw new Error("User ID cannot be empty!");
  return deleteUser(userId);
}

export default function Index() {
  const users = useLoaderData<typeof loader>();
  const transition = useTransition();
  return (
    <main className="mx-auto max-w-screen-lg overflow-auto rounded bg-white p-4 shadow">
      <div className="sticky left-0 mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold" id="title">
          Users
        </h1>
        <Link to="add">
          <Button size="small">Add</Button>
        </Link>
      </div>
      <Table aria-labelledby="title">
        <thead>
          <tr>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="whitespace-nowrap">Date of Birth</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Action</TableHead>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <TableCell className="whitespace-nowrap">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-center">
                {formatInTimeZone(user.dob, "Asia/Jakarta", "d MMM yyyy")}
              </TableCell>
              <TableCell className="capitalize">{user.gender}</TableCell>
              <TableCell className="text-center">
                <Link to={`${user.id}/edit`}>
                  <Button variant="text" size="small" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Form method="post">
                  <input
                    type="hidden"
                    name="_action"
                    value={`delete ${user.id}`}
                  />
                  <Button
                    name="id"
                    value={user.id}
                    variant="text"
                    color="danger"
                    size="small"
                    className="w-full"
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") ===
                      `delete ${user.id}`
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </Form>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
