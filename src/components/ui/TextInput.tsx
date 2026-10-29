"use client";

import { useField } from "./Field";

import type { InputHTMLAttributes } from "react";

const INPUT_CLASS =
  "box-border w-full border-[3px] border-ink px-3 py-2.5 text-sm font-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure";

const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const field = useField();

  // Inside a <Field> the field owns the id and the hint link, so the label and
  // description always resolve to this control.
  return (
    <input
      {...props}
      id={field?.id}
      aria-describedby={field?.describedBy}
      className={props.className ? `${INPUT_CLASS} ${props.className}` : INPUT_CLASS}
    />
  );
};

export default TextInput;
