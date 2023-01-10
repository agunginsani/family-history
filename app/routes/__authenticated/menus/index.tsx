import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { Button, Table, TableCell, TableHead } from "~/components";
import { deleteMenu, getMenus } from "~/model/menu.server";

export async function loader() {
  const menus = await getMenus();
  return menus;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const menuId = formData.get("id")?.toString();
  if (!menuId) throw new Error("Menu ID cannot be empty!");
  return deleteMenu(menuId);
}

export default function Index() {
  const menus = useLoaderData<typeof loader>();
  const transition = useTransition();
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
            <TableHead>Action</TableHead>
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
                <Form method="post">
                  <input
                    type="hidden"
                    name="_action"
                    value={`delete ${menu.id}`}
                  />
                  <Button
                    name="id"
                    value={menu.id}
                    variant="text"
                    color="danger"
                    size="small"
                    className="w-full"
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") ===
                      `delete ${menu.id}`
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
