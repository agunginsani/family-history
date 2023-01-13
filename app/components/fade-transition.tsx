import * as React from "react";
import Transition from "react-transition-group/Transition";

type FadeTransitionProps = {
  children: React.ReactElement;
  duration?: number;
  show?: boolean;
};

export function FadeTransition({
  children: child,
  duration = 200,
  show,
}: FadeTransitionProps) {
  const styles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: {},
  };
  return (
    <Transition
      in={show}
      nodeRef={child.props.ref}
      timeout={duration}
      unmountOnExit
    >
      {(state) =>
        React.cloneElement(child, {
          ...child.props,
          style: {
            transition: `opacity ${duration}ms ease-in-out`,
            opacity: 0,
            ...styles[state],
          },
        })
      }
    </Transition>
  );
}
