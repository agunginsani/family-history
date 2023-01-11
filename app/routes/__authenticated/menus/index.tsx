import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { Button, Table, TableCell, TableHead } from "~/components";
import { deleteMenu, getMenus } from "~/model/menu.server";

export async function loader() {
  const menus = await getMenus();
  return menus;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const id = z.string().uuid().parse(formData.get("id"));
  await deleteMenu(id);
  return null;
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
                <DeleteForm id={menu.id} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
