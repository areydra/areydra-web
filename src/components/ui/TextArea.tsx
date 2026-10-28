"use client";

import type { TextareaHTMLAttributes } from "react";

import { useField } from "./Field";

const TEXTAREA_CLASS =
  "box-border min-h-22.5 w-full resize-y border-[3px] border-ink px-3 py-2.5 text-sm font-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure";

const TextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const field = useField();

  return (
    <textarea
      {...props}
      id={field?.id}
      aria-describedby={field?.describedBy}
      className={props.className ? `${TEXTAREA_CLASS} ${props.className}` : TEXTAREA_CLASS}
    />
  );
};

export default TextArea;
