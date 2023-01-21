import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Table, TableCell, TableHead } from "~/components";
import { getMenus } from "~/model/menu.server";

export async function loader() {
  const menus = await getMenus();
  return menus;
}

type DeleteFormProps = {
  id: string;
};

function DeleteForm({ id }: DeleteFormProps) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action={`${id}/delete`}>
      <Button variant="text" color="danger" size="small" className="w-full">
        {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
      </Button>
    </fetcher.Form>
  );
}

export default function Index() {
  const menus = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-screen-lg overflow-auto rounded bg-white p-4 shadow">
      <div className="sticky left-0 mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold" id="title">
          Menus
        </h1>
        <Link to="add">
          <Button size="small">Add</Button>
        </Link>
      </div>
      <Table aria-labelledby="title">
        <thead>
          <tr>
            <TableHead>Name</TableHead>
            <TableHead>Path</TableHead>
            <TableHead className="min-w-[120px]">Action</TableHead>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <TableCell className="whitespace-nowrap">{menu.name}</TableCell>
              <TableCell>{menu.path}</TableCell>
              <TableCell className="text-center">
                <Link to={`${menu.id}/edit`}>
                  <Button variant="text" size="small" className="w-full">
                    Edit
                  </Button>
                </Link>
                <DeleteForm id={menu.id} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
