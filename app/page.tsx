"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { isMobile } from "react-device-detect";
import MyModal from "./components/my-dialog";
import { MEMBERID, PASSWORD } from "../utils/constants";
import { errorToast } from "../utils/toast";
import LoginPage from "./components/login_page";
import { useRouter } from "next/navigation";
import MyInput from "./components/my-input";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

    if (memberId !== MEMBERID) {
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
        window.open(`/analysis/${username}`, "_blank");
      } else open();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = JSON.parse(
        sessionStorage.getItem("isAuthenticate") ?? "false"
      );
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
      {/* <div className="w-full flex gap-4 mt-6 flex-col items-center justify-center">
        <div className="font-bold text-lg text-black/40">from</div>
        <Image
          src={"/images/meta logo.png"}
          width={120}
          height={50}
          alt="from Meta"
        />
      </div> */}
    </main>
    // <main
    //   className={`bg-[url('/bg_image/cover_page_bg.jpg')] w-screen h-screen bg-no-repeat bg-fixed bg-cover ${
    //     isOpen ? "blur-background" : ""
    //   }`}
    // >
    //   <MyModal
    //     isOpen={isOpen}
    //     open={open}
    //     close={close}
    //     handleLogin={handleLogin}
    //   />
    //   <div className="flex flex-col justify-center items-center h-[80%] relative">
    //     <div className="flex items-center justify-center absolute top-4 left-0 right-0">
    //       <Image
    //         src={"/Logo Black.png"}
    //         width={180}
    //         height={60}
    //         alt="Insta Analytice"
    //         // className="absolute top-4 left-4"
    //       />
    //     </div>
    //     <div className=" flex flex-col gap-4 items-center justify-center pt-20 sm:py-16">
    //       <div className="flex gap-2">
    //         <div className="font-black text-3xl  sm:text-5xl text-black text-center">
    //           ANALYZE YOUR CURRENT INSTAGRAM{" "}
    //           <TypeAnimation
    //             sequence={[
    //               // Same substring at the start will only be typed out once, initially

    //               "COMMENTS",
    //               1000,
    //               "LIKES",
    //               1000,
    //               "FOLLOWERS",
    //               1000,
    //               "REELS",
    //               1000,
    //               "",
    //               1000,
    //             ]}
    //             wrapper="span"
    //             speed={50}
    //             // style={{ fontSize: "2em", display: "inline-block" }}
    //             className="font-black text-3xl sm:text-5xl text-black text-cente"
    //             repeat={Infinity}
    //           />
    //         </div>
    //       </div>
    //       <div className="text-black text-xl text-center">
    //         {" "}
    //         • Dive into the details and discover the insights in your latest
    //         report •{" "}
    //       </div>
    //     </div>
    //     <div className="flex flex-col gap-2 justify-center items-center w-full pt-16">
    //       <div className=" bg-white/50 p-3  rounded-full flex items-center justify-center sm:w-[60%] h-min min-w-[320px] backdrop-blur-lg">
    //         <Image
    //           src={"/instagram-icon.png"}
    //           width={40}
    //           height={40}
    //           alt="input icon"
    //           className="mr-3"
    //         />
    //         <input
    //           placeholder="Enter username"
    //           value={username}
    //           onChange={(e) => {
    //             setUsername(e.target.value);
    //           }}
    //           className="focus:outline-none w-full bg-transparent placeholder-black/60 text-xl font-medium"
    //         />

    //         {loading ? (
    //           <Loader2 className="mr-2 w-10 h-10 animate-spin" />
    //         ) : (
    //           <div className="hidden sm:block">
    //             <AnalysisButton
    //               getProfileDetail={getProfileDetail}
    //               loading={loading}
    //             />
    //           </div>
    //         )}
    //       </div>
    //       <div className="block sm:hidden">
    //         <AnalysisButton
    //           getProfileDetail={getProfileDetail}
    //           loading={loading}
    //           isFullWith={true}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </main>
  );
}

const AnalysisButton = ({
  getProfileDetail,
  loading,
  isFullWith = false,
}: any) => {
  return (
    <Button
      variant="outline"
      onClick={getProfileDetail}
      disabled={loading}
      className={`flex ${
        isFullWith ? "sm:w-[60%] h-14 min-w-[320px]" : ""
      } items-center gap-2 border bg-gradient-to-r from-[#DC1699] font-medium  to-[#FD6D52] hover:text-white text-white px-6 py-2 rounded-full  hover:bg-gradient-to-r hover:from-[#DC1699]/80 hover:to-[#FD6D52]/80`}
    >
      <p className={isFullWith ? `text-xl` : "text-lg"}>Analyse Now</p>
    </Button>
  );
};
