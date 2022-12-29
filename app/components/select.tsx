import {
  useFloating,
  offset,
  flip,
  autoUpdate,
  useInteractions,
  useClick,
  useDismiss,
  useListNavigation,
  FloatingPortal,
} from "@floating-ui/react";
import clsx from "clsx";
import React from "react";
import { Transition } from "react-transition-group";
import { z } from "zod";

export const SelectValueSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
});

export const SelectOptionsSchema = z.array(SelectValueSchema);

type SelectProps<T = z.infer<typeof SelectValueSchema>> = Omit<
  React.ComponentPropsWithRef<"input">,
  "value" | "defaultValue" | "type" | "onChange" | "readOnly"
> & {
  options?: Array<T>;
  required?: boolean;
  defaultValue?: T;
  value?: T;
  onChange?: (payload: T) => void;
};

type Index = number | null;

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      defaultValue,
      value,
      className,
      required,
      name,
      options = [],
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<Index>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<Index>();

    const listItemRef = React.useRef<Array<HTMLElement | null>>([]);
    const selectRef = React.useRef<HTMLSelectElement>(null);

    const { x, y, reference, floating, refs, strategy, context } = useFloating({
      open: isOpen,
      placement: "bottom-start",
      middleware: [offset(8), flip()],
      whileElementsMounted: autoUpdate,
      onOpenChange: setIsOpen,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([
        useClick(context),
        useDismiss(context),
        useListNavigation(context, {
          listRef: listItemRef,
          activeIndex,
          selectedIndex,
          loop: true,
          onNavigate: setActiveIndex,
        }),
      ]);

    const expandedTransitionStyles = {
      entering: { opacity: 1 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
      exited: { opacity: 0 },
      unmounted: {},
    };

    function handleItemSelect(index: number) {
      setSelectedIndex(index);
      setIsOpen(false);
      const selected = options[index];
      onChange?.(selected);
      if (selectRef.current) selectRef.current.value = selected.id;
      (refs.domReference.current as HTMLInputElement).value = selected.name;
    }

    React.useImperativeHandle(
      ref,
      () => refs.reference.current as HTMLInputElement
    );

    React.useEffect(() => {
      const index = options.findIndex((opt) => opt.id === defaultValue?.id);
      if (index > -1) setSelectedIndex(index);
    }, [defaultValue?.id, options]);

    React.useEffect(() => {
      const index = options.findIndex((opt) => opt.id === value?.id);
      if (index > -1) setSelectedIndex(index);
    }, [options, value?.id]);

    return (
      <div className="relative">
        <select
          ref={selectRef}
          className="sr-only absolute bottom-0 w-full"
          tabIndex={-1}
          name={name}
          required={required}
          value={value?.id}
          defaultValue={defaultValue?.id}
          onChange={onChange ? () => {} : undefined}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <input
          ref={reference}
          className={clsx(
            "h-8 w-full rounded border border-gray-200 p-1 text-left",
            className
          )}
          value={value?.name}
          defaultValue={defaultValue?.name}
          onChange={onChange ? () => {} : undefined}
          readOnly
          {...getReferenceProps(props)}
        />
        <FloatingPortal>
          <Transition
            in={isOpen}
            nodeRef={refs.floating}
            timeout={200}
            unmountOnExit
          >
            {(state) => (
              <div
                ref={floating}
                className="grid overflow-hidden rounded bg-white opacity-0 shadow-lg transition-opacity duration-200 ease-out"
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  ...expandedTransitionStyles[state],
                }}
                {...getFloatingProps()}
              >
                {options.map((role, index) => (
                  <div
                    key={role.id}
                    ref={(node) => {
                      listItemRef.current[index] = node;
                    }}
                    className={clsx("rounded p-2 text-left", {
                      "bg-blue-50": activeIndex === index,
                    })}
                    role="option"
                    aria-selected={index === selectedIndex}
                    tabIndex={index === activeIndex ? 0 : -1}
                    {...getItemProps({
                      onClick: () => handleItemSelect(index),
                      onKeyDown: (event) => {
                        if (event.key === "Enter") {
                          handleItemSelect(index);
                        }
                      },
                    })}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            )}
          </Transition>
        </FloatingPortal>
      </div>
    );
  }
);

Select.displayName = "Select";
