import type { LinksFunction } from "@remix-run/node";
import { Links, Outlet, Scripts } from "@remix-run/react";
import styles from "./styles/app.css";

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html>
      <head>
        <Links />
        <title>Family History</title>
      </head>
      <body className="bg-gray-100">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
