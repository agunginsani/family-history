import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/db.server';

export async function loader({}: LoaderArgs) {
  const users = await prisma.user.findMany();
  console.log(users);
  return users;
}

export default function Users() {
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
