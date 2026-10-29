import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Field from "./Field";
import TextInput from "./TextInput";

describe("Field", () => {
  it("associates its label with the control it wraps", () => {
    render(
      <Field label="Email">
        <TextInput type="email" />
      </Field>,
    );

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("exposes the hint as the control's accessible description", () => {
    render(
      <Field
        label="Slug"
        hint="Lowercase letters and dashes only."
      >
        <TextInput />
      </Field>,
    );

    expect(
      screen.getByRole("textbox", { description: "Lowercase letters and dashes only." }),
    ).toBeInTheDocument();
  });

  it("renders a named group when the children are several controls", () => {
    render(
      <Field
        label="Tech stack"
        group
      >
        <input
          type="checkbox"
          aria-label="React"
        />
      </Field>,
    );

    expect(screen.getByRole("group", { name: "Tech stack" })).toBeInTheDocument();
  });
});
