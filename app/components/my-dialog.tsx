import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import MyInput from "./my-input";

export default function MyModal({ isOpen, open, close, handleLogin }: any) {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => {}}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/70 p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-lg/8 font-medium text-black text-center"
              >
                Authentication Required
              </DialogTitle>
              <p className="mt-4 text-sm/6 text-black/50 text-center">
                <b className="font-medium text-black">
                  {" "}
                  This website is exclusively accessible to Instagram approved
                  companies and their vendors.
                </b>
              </p>
              <p className="mb-4 mt-2 text-sm/6 text-black/50 text-center">
                Please use your provided credentials to enter.
              </p>
              <MyInput
                label={"Member ID"}
                value={memberId}
                onchange={(value: string) => setMemberId(value)}
              />
              <div className="my-4" />
              <MyInput
                label={"Security Pin"}
                value={password}
                type={"password"}
                onchange={(value: string) => setPassword(value)}
              />
              <div className="mt-8 flex gap-4 justify-center">
                <Button
                  className="inline-flex items-center  gap-2 rounded-2xl bg-[#f5004f]  py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={() => handleLogin(memberId, password)}
                >
                  Proceed
                </Button>
                <Button
                  className="inline-flex items-center  gap-2 rounded-2xl bg-black/10 text-black/50 py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Cancel
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
