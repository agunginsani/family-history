import {
  FloatingPortal,
  FloatingOverlay,
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  offset,
  FloatingFocusManager,
  autoUpdate,
} from "@floating-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useTransition,
} from "@remix-run/react";
import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { Transition } from "react-transition-group";
import { Button } from "~/components";
import { verifyUser } from "~/model/user.server";
import { destroySession, getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const user = await verifyUser(await session.get("token"));
    return { name: user.name, initial: user.name.charAt(0) };
  } catch (error) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

function Menu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { refs, context, reference, floating } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  const isMediumScreen = useMediaQuery({ minWidth: 768 });

  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const slideTransitionStyles = {
    entering: { left: 0, opacity: 1 },
    entered: { left: 0, opacity: 1 },
    exiting: { left: -256, opacity: 0 },
    exited: { left: -256, opacity: 0 },
    unmounted: {},
  };

  const fadeTransitionStyles = {
    entering: { opacity: 0.5 },
    entered: { opacity: 0.5 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: {},
  };

  const list = (
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
      <li>
        <Link to="sessions">
          <Button variant="text" className="w-full text-left">
            Session
          </Button>
        </Link>
      </li>
      <li>
        <Link to="menus">
          <Button variant="text" className="w-full text-left">
            Menu
          </Button>
        </Link>
      </li>
    </ul>
  );

  return (
    <>
      <button
        ref={reference}
        className="mr-2 rounded border-2 p-2 hover:bg-gray-50 md:hidden"
        {...getReferenceProps()}
      >
        <img
          width={20}
          height={20}
          src="/images/hamburger-menu.svg"
          alt="Toggle menu"
        />
      </button>
      <FloatingPortal id={isMediumScreen ? "z-0" : "z-1"}>
        {!isMediumScreen ? (
          <>
            <Transition
              in={isOpen}
              nodeRef={overlayRef}
              timeout={200}
              unmountOnExit
            >
              {(state) => (
                <FloatingOverlay
                  ref={overlayRef}
                  className="fixed left-0 top-0 z-10 h-screen w-screen bg-black opacity-0 transition-opacity duration-200 ease-in-out"
                  style={fadeTransitionStyles[state]}
                  lockScroll
                />
              )}
            </Transition>
            <Transition
              in={isOpen}
              nodeRef={refs.floating}
              timeout={200}
              unmountOnExit
            >
              {(state) => (
                <div
                  aria-modal="true"
                  className="fixed left-0 top-0 z-20 h-screen w-64 bg-white p-3 opacity-0 transition-all duration-200 ease-in-out"
                  ref={floating}
                  role="dialog"
                  style={slideTransitionStyles[state]}
                  {...getFloatingProps()}
                >
                  {list}
                </div>
              )}
            </Transition>
          </>
        ) : (
          <div className="fixed left-0 bottom-0 z-0 h-[calc(100vh_-_64px)] w-64 bg-white p-3 shadow">
            {list}
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

function Avatar() {
  const transition = useTransition();
  const user = useLoaderData<ReturnType<typeof loader>>();
  const [isOpen, setIsOpen] = React.useState(false);
  const { x, y, reference, floating, refs, context, strategy } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8)],
    placement: "bottom-end",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });
  const { getFloatingProps, getReferenceProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);
  const fadeTransitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: {},
  };
  return (
    <>
      <button
        ref={reference}
        className="h-10 w-10 rounded-full bg-slate-200 font-bold"
        {...getReferenceProps()}
      >
        {user.initial}
      </button>
      <FloatingPortal id="z-1">
        <Transition
          in={isOpen}
          timeout={200}
          nodeRef={refs.floating}
          unmountOnExit
        >
          {(state) => (
            <FloatingFocusManager context={context}>
              <div
                ref={floating}
                className="flex w-52 flex-col justify-center gap-y-2 overflow-hidden rounded border border-slate-200 bg-white p-3 opacity-0 shadow transition-opacity duration-200 ease-in-out"
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  ...fadeTransitionStyles[state],
                }}
                {...getFloatingProps()}
              >
                <div
                  className="m-auto grid h-20 w-20 place-content-center rounded-full bg-slate-200 font-bold"
                  {...getReferenceProps()}
                >
                  {user.initial}
                </div>
                <div className="text-center font-bold">{user.name}</div>
                <Link to="profile">
                  <Button variant="text" className="w-full">
                    Go to profile
                  </Button>
                </Link>
                <Form action="logout" method="post">
                  <Button
                    color="danger"
                    className="w-full"
                    name="_action"
                    value="logout"
                  >
                    {transition.state === "submitting" &&
                    transition.submission.formData.get("_action") === "logout"
                      ? "Logging out..."
                      : "Log out"}
                  </Button>
                </Form>
              </div>
            </FloatingFocusManager>
          )}
        </Transition>
      </FloatingPortal>
    </>
  );
}

export default function Authenticated() {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-3 shadow-md">
        <div>
          <Menu />
          <span className="mb-3 text-2xl font-bold">Family History</span>
        </div>
        <Avatar />
      </header>
      <div className="p-3 md:ml-64">
        <Outlet />
      </div>
    </>
  );
}
