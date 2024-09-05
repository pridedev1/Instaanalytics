"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MEMBERID, PASSWORD, TEMP_MEMBER } from "../../utils/constants";
import { errorToast } from "../../utils/toast";
import LoginPage from "../components/login_page";
import MyInput from "../components/my-input";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const router = useRouter();
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const handleLogin = (memberId: string, password: string) => {
    // Assuming you have a login function
    // loginUser();
    console.log("mer :", memberId);

    if (memberId !== TEMP_MEMBER) {
      errorToast("MemberId Don't match");
      return;
    }
    if (password !== PASSWORD) {
      errorToast("Password was incorrecy");
      return;
    }
    // Set isAuthenticate to true in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("isAuthenticate", "true");
    }
    setIsAuthenticate(true);
    // if (username === "" || username === undefined) return;
    // close();
    // window.open(`/analysis/${username}`, "_blank");
  };

  const getProfileDetail = async () => {
    if (username === "" || username === undefined) return;
    if (typeof window !== "undefined") {
      const isAuthenticate = sessionStorage.getItem("isAuthenticate");
      if (isAuthenticate) {
        close();
        // router.push(`/analysis/${username}`);
        window.open(`/analysis/${username}?via=ja`, "_blank");
      } else open();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = JSON.parse(
        sessionStorage.getItem("isAuthenticate") ?? "false"
      );
      console.log("isAuthenticate :", isAuth);
      setIsAuthenticate(isAuth);

      // if (!isAuthenticate) {
      //   // Redirect to login page or prompt login
      //   router.push("/login");
      // }
    }
  }, []);

  if (!isAuthenticate)
    return (
      <div>
        <LoginPage handleLogin={handleLogin} />
      </div>
    );
  return (
    <main className="w-full flex items-center flex-col gap-8 my-10">
      <div>
        <Image
          src={"/images/Logo Black.png"}
          width={250}
          height={50}
          alt="Instagram analyzer logo"
        />
      </div>
      <div className="my-auto" />
      <div className="w-72 scale-125">
        <div className="border rounded-md p-4 flex flex-col gap-2">
          <div className="mx-2 text-center font-medium">
            Enter your Instagram username to analyze your profile
          </div>
          <MyInput
            onchange={(value: string) => {
              setUsername(value);
            }}
            placeholder="Enter the username"
            value={username}
          />
          <div className="my-2" />
          <Button
            onClick={getProfileDetail}
            className="flex justify-center mx-4 items-center gap-2 rounded-full bg-[#0095F6] py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-[#0095F6]/70 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
          >
            Analyse Now
          </Button>
        </div>
      </div>
    </main>
  );
}
