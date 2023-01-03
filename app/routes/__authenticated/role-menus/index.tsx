import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { Button } from "~/components";
import { deleteRoleMenu, getRoleMenus } from "~/model/role-menu.server";

export async function loader() {
  const roleMenus = await getRoleMenus();
  return roleMenus;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const menuId = formData.get("id")?.toString();
  if (!menuId) throw new Error("Role Menu ID cannot be empty!");
  return deleteRoleMenu(menuId);
}

export default function Index() {
  const roleMenus = useLoaderData<typeof loader>();
  const transition = useTransition();
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
      <table aria-labelledby="title" className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Role</th>
            <th className="border p-2">Menu</th>
            <th className="border p-2">Path</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {roleMenus.map((roleMenu) => (
            <tr key={roleMenu.id}>
              <td className="border p-2">{roleMenu.role.name}</td>
              <td className="border p-2">{roleMenu.menu.name}</td>
              <td className="border p-2">{roleMenu.menu.path}</td>
              <td className="min-w-[120px] border p-2 text-center">
                <Link to={`${roleMenu.id}/edit`}>
                  <Button variant="text" size="small" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Form method="post">
                  <input
                    type="hidden"
                    name="_action"
                    value={`delete ${roleMenu.id}`}
                  />
                  <Button
                    name="id"
                    value={roleMenu.id}
                    variant="text"
                    color="danger"
                    size="small"
                    className="w-full"
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") ===
                      `delete ${roleMenu.id}`
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
