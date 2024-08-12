"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { client } from "./utils/axios";
import { useRouter } from "next/navigation";
import { ClipLoader, FadeLoader, MoonLoader } from "react-spinners";
import { Loader2 } from "lucide-react";
import { profile } from "console";

export default function Home() {
  const [username, setUsername] = useState("");

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const getProfileDetail = async () => {
    console.log("username :", username);
    if (username === "") return;
    setLoading(true);
    let res = await client(`/get-profile-details?username=${username}`);

    let data = res.data;

    data['profile_pic'] = encodeURIComponent(data['profile_pic'] ?? "")
    if (data.success) {
      router.push(`/analytics/${username}?data=${JSON.stringify(data)}`);
    } else {
      console.log("error in getting the analytics :", res);
    }
    console.log("data :", res.data);

    setLoading(false);
  };

  return (
    <main className="bg-[url('/bg_image/cover_page_bg.jpg')] w-screen h-screen bg-no-repeat bg-fixed bg-cover">
      <div className="flex flex-col justify-center items-center h-[80%]">
        <div className=" flex flex-col gap-4 items-center justify-center py-16">
          <div className="font-black text-4xl text-white text-center">
            ANALYZE YOUR CURRENT INSTAGRAM
          </div>
          <div className="text-white text-xl text-center">
            {" "}
            • Dive into the details and discover the insidhts in your latest
            report •{" "}
          </div>
        </div>
        <div className="flex justify-center items-center w-full pt-16">
          <div className=" bg-white/50 p-3 pl-8 rounded-full flex items-center justify-center w-[50%] h-min min-w-[280px] backdrop-blur-lg">
            <input
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="focus:outline-none w-full bg-transparent placeholder-black text-xl font-medium"
            />
            {loading ? (
              <Loader2 className="mr-2 w-10 h-10 animate-spin" />
            ) : (
              <Button
                variant="outline"
                onClick={getProfileDetail}
                disabled={loading}
                className="flex items-center gap-2 border border-black/80 text-black/70 px-2 py-1 rounded-full bg-transparent hover:bg-white/30"
              >
                <svg
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
                </svg>
                <p className="font-bold text-lg">Search</p>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
