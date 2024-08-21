import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

export default function MyInput({
  onchange,
  value,
  label,
  type = "text",
}: any) {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-black">{label}</Label>
        <Input
          value={value}
          onChange={(e) => onchange(e.target.value)}
          type={type}
          className={clsx(
            "mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
          )}
        />
      </Field>
    </div>
  );
}
