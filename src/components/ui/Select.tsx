"use client";

import type { SelectHTMLAttributes } from "react";

import { useField } from "./Field";

const SELECT_CLASS =
  "box-border w-full border-[3px] border-ink px-3 py-2.5 text-sm font-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure";

const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
  const field = useField();

  return (
    <select
      {...props}
      id={field?.id}
      aria-describedby={field?.describedBy}
      className={props.className ? `${SELECT_CLASS} ${props.className}` : SELECT_CLASS}
    />
  );
};

export default Select;
