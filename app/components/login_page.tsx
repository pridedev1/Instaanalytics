"use client";
import { Button } from "@headlessui/react";
import MyInput from "./my-input";
import { useState } from "react";
import Image from "next/image";

const LoginPage = () => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <div
        // open={isOpen}
        // as="div"
        className="relative h-screen z-10 focus:outline-none flex gap-2 justify-center  items-center"
        // onClose={() => {}}
      >
        <div className="h-[700px] w-[360px] border  flex items-center justify-center rounded-lg">
          phone image
        </div>
        <div className=" inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full w-96 items-center justify-center p-4">
            <div
              //   transition
              className="w-full border max-w-lg rounded-xl bg-white/70 p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex justify-center">
                <Image
                  src={"/insta-login.png"}
                  width={200}
                  height={50}
                  alt="instagram analyzier"
                />
              </div>
              {/* <div
                // as="h3"
                className="text-lg/8 font-medium text-black text-center"
              >
                Authentication Required
              </div> */}
              {/* <p className="mt-4 text-sm/6 text-black/50 text-center">
                <b className="font-medium text-black">
                  {" "}
                  This website is exclusively accessible to Instagram approved
                  companies and their vendors.
                </b>
              </p>
              <p className="mb-4 mt-2 text-sm/6 text-black/50 text-center">
                Please use your provided credentials to enter.
              </p> */}
              <MyInput
                label={"Member ID"}
                value={memberId}
                placeholder="Phone number, username or email address"
                onchange={(value: string) => setMemberId(value)}
              />
              <div className="my-4" />
              <MyInput
                label={"Security Pin"}
                value={password}
                type={"password"}
                placeholder="Password"
                onchange={(value: string) => setPassword(value)}
              />
              <div className="mt-8 flex gap-4 justify-center">
                <Button
                  className="inline-flex items-center  gap-2 rounded-2xl bg-[#f5004f]  py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  //   onClick={() => handleLogin(memberId, password)}
                >
                  Proceed
                </Button>
                {/* <Button
                  className="inline-flex items-center  gap-2 rounded-2xl bg-black/10 text-black/50 py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Cancel
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
