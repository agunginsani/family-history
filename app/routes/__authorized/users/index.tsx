import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/db.server";

export async function loader() {
  const users = await prisma.user.findMany();
  return users;
}

export default function Index() {
  const users = useLoaderData<ReturnType<typeof loader>>();
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
