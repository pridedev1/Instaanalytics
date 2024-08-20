"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { isMobile } from "react-device-detect";

export default function Home() {
  const [username, setUsername] = useState("");

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const getProfileDetail = async () => {
    if (username === "" || username === undefined) return;

    router.push(`/analysis/${username}`);

    // let docRef = doc(db, `/insta-ids/${username}`);

    // let snap = await getDoc(docRef);
    // console.log("exist :", snap.exists());

    // let data;
    // if (!snap.exists()) {
    //   if (username === "") return;
    //   setLoading(true);
    //   try {
    //     let res = await client(`/get-profile-details?username=${username}`);

    //      data = res.data;

    //     console.log("data :", res.data);

    //     await setDoc(docRef, data, { merge: true });
    //   } catch (error) {
    //     console.log("unable to get data :", error);
    //     errorToast("unable to generate report");
    //     setLoading(false);
    //     return;
    //   }
    // } else {
    //   data = snap.data();
    // }

    // data!["profile_pic"] = encodeURIComponent(data!["profile_pic"] ?? "");
    // if (data!.success) {
    //   router.push(`/analytics/${username}?data=${JSON.stringify(data)}`);
    // }

    // setLoading(false);
  };

  return (
    <main className="bg-[url('/bg_image/cover_page_bg.jpg')] w-screen h-screen bg-no-repeat bg-fixed bg-cover">
      <div className="flex flex-col justify-center items-center h-[80%] relative">
        <div className="flex items-center justify-center absolute top-4 left-0 right-0">
          <Image
            src={"/Logo Black.png"}
            width={180}
            height={60}
            alt="Insta Analytice"
            // className="absolute top-4 left-4"
          />
        </div>
        <div className=" flex flex-col gap-4 items-center justify-center pt-20 sm:py-16">
          <div className="flex gap-2">
            <div className="font-black text-3xl  sm:text-5xl text-black text-center">
              ANALYZE YOUR CURRENT INSTAGRAM{" "}
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially

                  "COMMENTS",
                  1000,
                  "LIKES",
                  1000,
                  "FOLLOWERS",
                  1000,
                  "REELS",
                  1000,
                  "",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                // style={{ fontSize: "2em", display: "inline-block" }}
                className="font-black text-3xl sm:text-5xl text-black text-cente"
                repeat={Infinity}
              />
            </div>
          </div>
          <div className="text-black text-xl text-center">
            {" "}
            • Dive into the details and discover the insights in your latest
            report •{" "}
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center w-full pt-16">
          <div className=" bg-white/50 p-3  rounded-full flex items-center justify-center sm:w-[60%] h-min min-w-[320px] backdrop-blur-lg">
            <Image
              src={"/instagram-icon.png"}
              width={40}
              height={40}
              alt="input icon"
              className="mr-3"
            />
            <input
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="focus:outline-none w-full bg-transparent placeholder-black/60 text-xl font-medium"
            />

            {loading ? (
              <Loader2 className="mr-2 w-10 h-10 animate-spin" />
            ) : (
              <div className="hidden sm:block">
                <AnalysisButton
                  getProfileDetail={getProfileDetail}
                  loading={loading}
                />
              </div>
            )}
          </div>
          <div className="block sm:hidden">
            <AnalysisButton
              getProfileDetail={getProfileDetail}
              loading={loading}
              isFullWith={true}
            />
          </div>
        </div>
      </div>
    </main>
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
      } items-center gap-2 border bg-blue-300 border-black/30 text-black/70 px-6 py-2 rounded-full  hover:bg-blue-300/60`}
    >
      {/* <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  className=" "
  // class="lucide lucide-move-left"
>
  <path d="M6 8L2 12L6 16" />
  <path d="M2 12H22" />
</svg> */}
      <p className=" text-lg">Analyse Now</p>
    </Button>
  );
};
