import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { Button, Table, TableCell, TableHead } from "~/components";
import { getUsers } from "~/model/user.server";

export function loader() {
  return getUsers();
}

type DeleteFormProps = {
  id: string;
};

function DeleteForm({ id }: DeleteFormProps) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action={`${id}/delete`}>
      <input type="hidden" name="id" value={id} />
      <Button className="w-full" color="danger" size="small" variant="text">
        {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
      </Button>
    </fetcher.Form>
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
            <TableHead className="min-w-[120px]">Action</TableHead>
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
