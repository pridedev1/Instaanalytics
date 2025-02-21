"use client";
import { Button } from "@headlessui/react";
import MyInput from "./my-input";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/screenshot1.png",
  "/screenshot2.png",
  "/screenshot3.png",
  "/screenshot4.png",
  // Add more image paths as needed
];

const LoginPage = ({ handleLogin }: any) => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rememberMe, setRememberMe] = useState(true); // New state for "Remember Me"

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="relative h-screen z-10 focus:outline-none flex gap-2 justify-center items-center">
        <div className="flex">
          <div className=" hidden md:flex items-center justify-center rounded-lg overflow-hidden">
            <div className="relative h-[600px] w-[470px] bg-[url('/phone-mockup.png')] bg-no-repeat bg-[length:460px_625px]">
              {/* <Image
              src={"/phone-mockup.png"}
              fill
              // width={360}
              // height={700}
              alt="phone mock"
            /> */}
              {images.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`carousel image ${index}`}
                  width={250}
                  height={500}
                  // layout="fill"
                  // objectFit="contain"
                  className={`absolute right-[68px] top-[24px] transition-opacity duration-1000 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="inset-0 z-10 overflow-y-auto">
            <div className="flex w-96 items-center justify-center p-4 py-14">
              <div className="w-full border max-w-lg rounded-xl bg-white/70 p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                <div className="flex justify-center">
                  <Image
                    src={"/insta-login.png"}
                    width={200}
                    height={50}
                    alt="instagram analyzer"
                  />
                </div>
                <MyInput
                  label={"Member ID"}
                  value={memberId}
                  placeholder="Member id"
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
                <div className="mt-4 flex items-center px-4">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                  />
                  <label htmlFor="rememberMe" className="text-sm">
                    Remember Me
                  </label>
                </div>
                <div className="mt-8 flex gap-4 justify-center">
                  <Button
                    onClick={() => handleLogin(memberId, password, rememberMe)}
                    className="flex justify-center mx-4 items-center gap-2 rounded-full w-full bg-[#0095F6] py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-[#0095F6]/70 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  >
                    Log in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
