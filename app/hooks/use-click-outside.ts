import * as React from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: Event) => void
) {
  const handlerRef = React.useRef(handler);
  React.useEffect(() => {
    function listener(event: Event) {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }
      handlerRef.current(event);
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}
