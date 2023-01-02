import type { ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "~/components";
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
      <table aria-labelledby="title" className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">OS</th>
            <th className="border p-2">Browser</th>
            <th className="border p-2">Device</th>
            <th className="border p-2">Created at</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.token}>
              <td className="border p-2">{session.user.email}</td>
              <td className="whitespace-nowrap border p-2">{session.os}</td>
              <td className="whitespace-nowrap border p-2">
                {session.browser}
              </td>
              <td className="whitespace-nowrap border p-2">{session.device}</td>
              <td className="whitespace-nowrap border p-2 text-center">
                {formatInTimeZone(
                  session.createdAt,
                  "Asia/Jakarta",
                  "d MMM yyyy HH:mm"
                )}
              </td>
              <td className="min-w-[120px] border p-2 text-center">
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
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") ===
                      `delete ${session.token}`
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
