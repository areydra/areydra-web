"use client";

import { Field, Select, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import RichTextEditor from "@/components/majourney/RichTextEditor";
import { MONTH_NAMES, STATUS_OPTIONS } from "@/lib/majourney/work-history";
import type { WorkHistoryInput } from "@/lib/majourney/inputs";
import type { WorkStatus } from "@/lib/api-types";

type WorkHistoryFormProps = {
  form: WorkHistoryInput;
  setField: <K extends keyof WorkHistoryInput>(key: K, value: WorkHistoryInput[K]) => void;
};

export default function WorkHistoryForm({ form, setField }: WorkHistoryFormProps) {
  return (
    <>
      <Field label="Company">
        <TextInput value={form.company} onChange={(e) => setField("company", e.target.value)} />
      </Field>
      <Field label="Role">
        <TextInput value={form.role} onChange={(e) => setField("role", e.target.value)} />
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={(e) => setField("status", e.target.value as WorkStatus)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="mb-3.5 grid grid-cols-2 gap-2">
        <Field label="Start Month">
          <Select value={form.startMonth} onChange={(e) => setField("startMonth", Number(e.target.value))}>
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Start Year">
          <TextInput
            type="number"
            value={form.startYear}
            onChange={(e) => setField("startYear", Number(e.target.value))}
          />
        </Field>
      </div>
      <div className="mb-3.5 grid grid-cols-2 gap-2">
        <Field label="End Month">
          <Select
            value={form.endMonth ?? ""}
            onChange={(e) => setField("endMonth", e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Present</option>
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="End Year">
          <TextInput
            type="number"
            value={form.endYear ?? ""}
            onChange={(e) => setField("endYear", e.target.value ? Number(e.target.value) : null)}
            placeholder="blank = present"
          />
        </Field>
      </div>
      <div className="mb-3.5">
        <ImageUploadField
          label="Company Logo"
          value={form.companyLogoUrl}
          onChange={(url) => setField("companyLogoUrl", url)}
          folder="work-history"
        />
      </div>
      <Field label="Description">
        <RichTextEditor value={form.description} onChange={(html) => setField("description", html)} />
      </Field>
    </>
  );
}
