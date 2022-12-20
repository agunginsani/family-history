import { Outlet, Scripts } from '@remix-run/react';
import * as React from 'react';

export default function App() {
  return (
    <html>
      <head>
        <title>My First Remix App</title>
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
