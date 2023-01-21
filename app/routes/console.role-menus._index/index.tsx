import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Table, TableCell, TableHead } from "~/components";
import { getRoleMenus } from "~/model/role-menu.server";

export function loader() {
  return getRoleMenus();
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
  const roleMenus = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-screen-lg overflow-auto rounded bg-white p-4 shadow">
      <div className="sticky left-0 mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold" id="title">
          Role Menus
        </h1>
        <Link to="add">
          <Button size="small">Add</Button>
        </Link>
      </div>
      <Table aria-labelledby="title">
        <thead>
          <tr>
            <TableHead>Role</TableHead>
            <TableHead>Menu</TableHead>
            <TableHead>Path</TableHead>
            <TableHead className="w-min-[120px]">Action</TableHead>
          </tr>
        </thead>
        <tbody>
          {roleMenus.map((roleMenu) => (
            <tr key={roleMenu.id}>
              <TableCell>{roleMenu.role.name}</TableCell>
              <TableCell>{roleMenu.menu.name}</TableCell>
              <TableCell>{roleMenu.menu.path}</TableCell>
              <TableCell className="text-center">
                <Link to={`${roleMenu.id}/edit`}>
                  <Button variant="text" size="small" className="w-full">
                    Edit
                  </Button>
                </Link>
                <DeleteForm id={roleMenu.id} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
