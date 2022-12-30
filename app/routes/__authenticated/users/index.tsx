import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "~/components";
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
  const users = useLoaderData<ReturnType<typeof loader>>();
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
      <table aria-labelledby="title" className="w-full border-collapse border">
        <thead>
          <tr>
            <th className=" border p-2">Name</th>
            <th className=" border p-2">Email</th>
            <th className=" whitespace-nowrap border p-2">Date of Birth</th>
            <th className=" border p-2">Gender</th>
            <th className=" border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap border p-2">{user.name}</td>
              <td className="border p-2 text-blue-400 underline">
                <Link to={`${user.id}/edit`}>{user.email}</Link>
              </td>
              <td className="border p-2">
                {formatInTimeZone(user.dob, "Asia/Jakarta", "d MMM yyyy")}
              </td>
              <td className="border p-2 capitalize">{user.gender}</td>
              <td className="min-w-[120px] border p-2 text-center">
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
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") ===
                      `delete ${user.id}`
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </Form>
                <Link to={`${user.id}/edit`}>
                  <Button variant="text">Edit</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
