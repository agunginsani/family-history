import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLocation,
  useTransition,
} from "@remix-run/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Transition } from "react-transition-group";
import { Button } from "~/components";
import { useClickOutside } from "~/hooks";
import { session } from "~/utils/cookies.server";

export async function loader({ request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  try {
    return await session.verify(cookie);
  } catch (error) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await session.serialize("", { expires: new Date() }),
      },
    });
  }
}

function Menu() {
  const [isVisible, setIsVisible] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setIsVisible(false);
  });

  const location = useLocation();
  React.useEffect(() => {
    setIsVisible(false);
  }, [location.pathname]);

  const slideTransitionStyles = {
    entering: { left: 0 },
    entered: { left: 0 },
    exiting: { left: -256 },
    exited: { left: -256 },
    unmounted: {},
  };

  const fadeTransitionStyles = {
    entering: { opacity: 0.5 },
    entered: { opacity: 0.5 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: {},
  };

  return (
    <>
      <button
        className="mr-2 rounded border-2 p-2 hover:bg-gray-50"
        onClick={() => setIsVisible(true)}
      >
        <img
          width={20}
          height={20}
          src="/images/hamburger-menu.svg"
          alt="Toggle menu"
        />
      </button>
      <Transition
        in={isVisible}
        nodeRef={overlayRef}
        timeout={200}
        unmountOnExit
      >
        {(state) =>
          ReactDOM.createPortal(
            <div
              ref={overlayRef}
              className="fixed left-0 top-0 z-10 h-screen w-screen bg-black opacity-0"
              style={{
                transition: `opacity 200ms ease-in-out`,
                ...fadeTransitionStyles[state],
              }}
            />,
            document.body
          )
        }
      </Transition>
      <Transition in={isVisible} nodeRef={menuRef} timeout={200} unmountOnExit>
        {(state) =>
          ReactDOM.createPortal(
            <div
              aria-modal="true"
              className="fixed left-0 top-0 z-20 h-screen w-64 bg-white p-3"
              ref={menuRef}
              role="dialog"
              style={{
                transition: `left 200ms ease-in-out`,
                ...slideTransitionStyles[state],
              }}
            >
              <ul className="grid gap-y-2">
                <li>
                  <Link to="">
                    <Button variant="text" className="w-full text-left">
                      Home
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="users">
                    <Button variant="text" className="w-full text-left">
                      User
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>,
            document.body
          )
        }
      </Transition>
    </>
  );
}

export default function Index() {
  const transition = useTransition();
  return (
    <div>
      <header className="sticky top-0 flex h-16 items-center justify-between bg-white px-3 shadow-md">
        <div>
          <Menu />
          <span className="mb-3 text-2xl font-bold">Family History</span>
        </div>
        <Form action="logout" method="post">
          <Button variant="text" size="small" name="_action" value="logout">
            {transition.state === "submitting" &&
            transition.submission.formData.get("_action") === "logout"
              ? "Logging out..."
              : "Log out"}
          </Button>
        </Form>
      </header>
      <div className="mt-5 px-3">
        <Outlet />
      </div>
    </div>
  );
}
