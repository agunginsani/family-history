import type { ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { Button, Table, TableCell, TableHead } from "~/components";
import { deleteSession, getSessions } from "~/model/session.server";

export async function loader() {
  const sessions = await getSessions();
  return sessions;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const userId = formData.get("id")?.toString();
  if (!userId) throw new Error("User ID cannot be empty!");
  return deleteSession(userId);
}

export default function Index() {
  const sessions = useLoaderData<ReturnType<typeof loader>>();
  const transition = useTransition();
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
            <TableHead>Action</TableHead>
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
                {formatInTimeZone(
                  session.createdAt,
                  "Asia/Jakarta",
                  "d MMM yyyy HH:mm"
                )}
              </TableCell>
              <TableCell className="text-center">
                <Form method="post">
                  <input
                    type="hidden"
                    name="_action"
                    value={`delete ${session.token}`}
                  />
                  <Button
                    name="id"
                    value={session.token}
                    variant="text"
                    color="danger"
                    size="small"
                    className="w-full"
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") ===
                      `delete ${session.token}`
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
