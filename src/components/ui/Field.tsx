"use client";

import { createContext, useContext, useId, type ReactNode } from "react";

interface FieldContextValue {
  /** Id the wrapping `<label htmlFor>` points at. */
  id: string;
  /** Id of the hint text, so the control can reference it. */
  describedBy?: string;
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined);

/**
 * Read by the control rendered inside a `<Field>`; controls take their id from
 * here so the label always points at them.
 */
export function useField() {
  return useContext(FieldContext);
}

interface FieldProps {
  label: string;
  /** Set when the children are a group of controls rather than a single one. */
  group?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}

const Field = ({ label, group = false, hint, className, children }: FieldProps) => {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const wrapperClass = className ? `mb-3.5 ${className}` : "mb-3.5";

  if (group) {
    return (
      <div className={wrapperClass}>
        <div
          id={labelId}
          className="text-ink mb-1.5 block text-[13px] font-semibold"
        >
          {label}
        </div>
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={hint ? hintId : undefined}
        >
          {children}
        </div>
        {hint ? (
          <p
            id={hintId}
            className="text-ink-muted mt-1 text-xs"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <FieldContext.Provider value={{ id, describedBy: hint ? hintId : undefined }}>
        <label
          htmlFor={id}
          className="text-ink mb-1.5 block text-[13px] font-semibold"
        >
          {label}
        </label>
        {children}
        {hint ? (
          <p
            id={hintId}
            className="text-ink-muted mt-1 text-xs"
          >
            {hint}
          </p>
        ) : null}
      </FieldContext.Provider>
    </div>
  );
};

export default Field;
