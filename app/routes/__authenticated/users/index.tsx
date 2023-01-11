import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import { Button, Table, TableCell, TableHead } from "~/components";
import type { ActionResponse } from "~/components/user-form";
import { deleteUser, getUsers } from "~/model/user.server";

export function loader() {
  return getUsers();
}

export async function action({ request }: ActionArgs): Promise<ActionResponse> {
  const formData = await request.formData();
  const id = z.string().uuid().parse(formData.get("id"));
  try {
    await deleteUser(id);
    return { type: "success", message: "Delete success!" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type DeleteFormProps = {
  id: string;
};

function DeleteForm({ id }: DeleteFormProps) {
  const ACTION_VALUE = `DELETE_${id}`;
  const navigation = useNavigation();
  return (
    <Form method="delete">
      <input type="hidden" name="id" value={id} />
      <Button
        name="_action"
        value={ACTION_VALUE}
        variant="text"
        color="danger"
        size="small"
        className="w-full"
      >
        {navigation.state === "submitting" &&
        navigation.formData.get("_action") === ACTION_VALUE
          ? "Deleting..."
          : "Delete"}
      </Button>
    </Form>
  );
}

export default function Index() {
  const users = useLoaderData<typeof loader>();
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
                <DeleteForm id={user.id} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
