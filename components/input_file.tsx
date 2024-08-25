import { Input } from "@/components/ui/input";
import { ChangeEventHandler } from "react";

function InputFile({
  onChange,
  accept,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  accept?: string;
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        className="border-dashed border-2  "
        id="picture"
        accept={accept}
        type="file"
        onChange={onChange}
      />
    </div>
  );
}

export default InputFile;
