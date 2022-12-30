import type { LinksFunction } from "@remix-run/node";
import { Links, Outlet, Scripts } from "@remix-run/react";
import styles from "./styles/app.css";

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Root() {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Family History</title>
        <Links />
      </head>
      <body className="bg-gray-100">
        <div id="z-0" className="relative z-0">
          <Outlet />
        </div>
        <div id="z-1" className="z-1 relative" />
        <Scripts />
      </body>
    </html>
  );
}
