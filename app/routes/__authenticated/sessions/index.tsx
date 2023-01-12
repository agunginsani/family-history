import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Table, TableCell, TableHead } from "~/components";
import { getSessions } from "~/model/session.server";
import { formatDateTime } from "~/utils/date";

export async function loader() {
  const sessions = await getSessions();
  return sessions;
}

type DeleteFormProps = {
  token: string;
};

function DeleteForm({ token }: DeleteFormProps) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="delete" action={`${token}/delete`}>
      <input type="hidden" name="token" value={token} />
      <Button variant="text" color="danger" size="small" className="w-full">
        {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
      </Button>
    </fetcher.Form>
  );
}

export default function Index() {
  const sessions = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-screen-lg overflow-auto rounded bg-white p-4 shadow">
      <div className="sticky left-0 mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold" id="title">
          Sessions
        </h1>
      </div>
      <Table aria-labelledby="title">
        <thead>
          <tr>
            <TableHead>Email</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead className="min-w-[120px]">Action</TableHead>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.token}>
              <TableCell>{session.user.email}</TableCell>
              <TableCell className="whitespace-nowrap">{session.os}</TableCell>
              <TableCell className="whitespace-nowrap">
                {session.browser}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {session.device}
              </TableCell>
              <TableCell className="whitespace-nowrap text-center">
                {formatDateTime(session.createdAt)}
              </TableCell>
              <TableCell className="text-center">
                <DeleteForm token={session.token} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
