import type { ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { Button, Table, TableCell, TableHead } from "~/components";
import { deleteSession, getSessions } from "~/model/session.server";
import { formatDateTime } from "~/utils/date";

export async function loader() {
  const sessions = await getSessions();
  return sessions;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const token = z.string().parse(formData.get("token"));
  return deleteSession(token);
}

type DeleteFormProps = {
  token: string;
};

function DeleteForm({ token }: DeleteFormProps) {
  const ACTION_VALUE = `DELETE_${token}`;
  const navigation = useNavigation();
  return (
    <Form method="delete">
      <input type="hidden" name="id" value={token} />
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
