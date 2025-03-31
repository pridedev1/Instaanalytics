import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

export default function MyInput({
  onchange,
  value,
  label,
  placeholder,
  type = "text",
  name = "",
}: any) {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        {/* <Label className="text-sm/6 font-medium text-black">{label}</Label> */}
        <Input
          value={value}
          onChange={(e) => onchange(e.target.value)}
          type={type}
          autoComplete={name}
          name={name}
          placeholder={placeholder}
          className={clsx(
            "mt-3 block w-full rounded-sm  border border-gray-300 bg-[#FAFAFA] py-1.5 px-3 text-sm/6 text-black",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
          )}
        />
      </Field>
    </div>
  );
}
