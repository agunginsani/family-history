import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "~/components";
import { getUsers } from "~/model/user.server";

export async function loader() {
  const users = await getUsers();
  return users;
}

export default function Index() {
  const users = useLoaderData<ReturnType<typeof loader>>();
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
            <th className=" border px-2">Name</th>
            <th className=" border px-2">Email</th>
            <th className=" whitespace-nowrap border px-2">Date of Birth</th>
            <th className=" border px-2">Gender</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap border px-2">{user.name}</td>
              <td className="border px-2 text-blue-400 underline">
                <Link to={`${user.id}`}>{user.email}</Link>
              </td>
              <td className="border px-2">
                {formatInTimeZone(user.dob, 'Asia/Jakarta', "d MMM yyyy")}
              </td>
              <td className="border px-2 capitalize">{user.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
