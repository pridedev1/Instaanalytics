"use client";

import LineChart from "./components/line_chart";
import Image from "next/image";
import ProfileReport from "./components/profile_report";
import BarChart from "./components/bar-chart";
import { useEffect, useState } from "react";
import { Loader2, MoveUp, Share2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import PostAnalysis from "./components/post_analysis";
import ProfileDataHistory from "./components/porfile_data_history";
import WordCloudChart from "./components/word_cloud_chart";
import FollowerGrowthGraph from "./components/follower_growth_graph";
import FollowerGrowthOverview from "./components/follower_growth_overview";
import HashtagList from "./components/hash_tag_list";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuth } from "@/utils/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { errorToast } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const ProfileAnalytics = ({
  preview = false,
  profileD,
  followingD,
  updatedD = {},
}: {
  preview?: boolean;
  profileD?: any;
  followingD?: any;
  updatedD?: any;
}) => {
  const [profileData, setProfileData] = useState<any>(profileD);
  const [followerData, setFollowerData] = useState<any>(followingD);
  const [loading, setLoading] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const { user } = useAuth();
  let { id } = useParams();

  const [updatedDetails, setUpdatedDetials] = useState<any>(updatedD);
  let searchParams = useSearchParams();

  const fetchData = async (id: string) => {
    try {
      // check if it exist in our database

      const accountRef = doc(db, `/accounts/${id}`);

      let d = await getDoc(accountRef);

      if (d.exists()) {
        console.log("data :", d.data());

        setUpdatedDetials(d.data());
      }
      setLoading(true);
      let via = searchParams.get("via");

      let backednUrl = process.env.NEXT_PUBLIC_API_URL?.includes(
        "http://localhost:3001"
      )
        ? `http://localhost:3001/profile-report?username=${id}`
        : `${
            process.env.NEXT_PUBLIC_API_URL
          }/api-proxy?serId=${encodeURIComponent(
            `http://137.184.183.57/profile-report?username=${id}`
          )}`;

      if (via === "test") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://128.199.118.38/profile-report2?username=${id}`
        )}`;
      } else if (via === "ca") {
        backednUrl = `${process.env.NEXT_PUBLIC_API_URL}/profile-report?username=${id}`;
      } else if (via === "ja") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://146.190.32.67/profile-report2?username=${id}`
        )}`;
      } else if (via === "vs") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://137.184.230.17/profile-report2?username=${id}`
        )}`;
      } else if (via === "ab") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://146.190.160.210/profile-report2?username=${id}`
        )}`;
      } else if (via === "im") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://164.90.152.48/profile-report2?username=${id}`
        )}`;
      } else if (via === "ss") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://143.110.154.55/profile-report2?username=${id}`
        )}`;
      } else if (via === "ad") {
        backednUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api-proxy?serId=${encodeURIComponent(
          `http://143.198.138.39/profile-report?username=${id}`
        )}`;
      }

      console.log("url :", backednUrl);

      let res = await axios.get(backednUrl);
      let data = res.data;
      console.log("data ;", data);

      if (!data["success"]) throw "Unable to get the report";

      setFollowerData(data["followingData"]);
      setProfileData(data["profileData"]);
    } catch (error) {
      // errorToast(error.toString());
      console.log("error in getting profile report :", error);
      setFollowerData({});
      setProfileData({});
    } finally {
      setLoading(false);
    }
    console.log("loading :", loading);
  };

  const shareAbleLink = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }

    try {
      const userRef = doc(db, `/share/${id}`);

      await setDoc(
        userRef,
        {
          username: id,
          userId: user!.id,
          userEmail: user!.email,
          createdAt: new Date(),
          profileData: profileData,
          followingData: followerData,
        },
        { merge: true }
      );

      setShowShareLink(true);
    } catch (error) {
      errorToast("Unable to share");
      console.log("error in sharing :", error);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fade, setFade] = useState(true);
  const messages = [
    "Analyzing your Instagram profile. Please be patient.",
    "Examining your Instagram posts.",
    "Analyzing your content for insights.",
    "Creating a detailed report.",
  ];
  useEffect(() => {
    const isAuthenticated = !!Cookies.get("userData");

    if (!isAuthenticated) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (!preview) {
      const timer = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentMessage(
            (prevMessage) => (prevMessage + 1) % messages.length
          );
          setFade(true);
        }, 500); // Adjust the timeout to match the fade-out duration
      }, 3000);
      return () => clearInterval(timer);
    }
  }, []);
  useEffect(() => {
    if (!preview) fetchData(id as string);
    console.log("loafing data");
  }, []);
  console.log("profile data :", profileData);
  console.log("follower data :", followerData);

  if (profileData === undefined || followerData === undefined)
    return (
      <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
        <div
          className={`m-4 text-center transition-opacity duration-1000 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {messages[currentMessage]}
        </div>
      </div>
    );

  let lastPost =
    profileData.media != undefined && profileData.media.length != 0
      ? profileData.media[0]
      : undefined;

  return (
    <div className="flex flex-col items-center justify-center relative bg-no-repeat bg-fixed bg-cover">
      {/* Add print button */}
      <ShareLinkDialog
        open={showShareLink}
        username={id as any}
        onClose={() => setShowShareLink(false)}
      />{" "}
      {!preview && (
        <div className="fixed top-4 right-4 print:hidden z-50">
          <Button variant={"outline"} onClick={shareAbleLink}>
            <Share2 />
            Share
          </Button>
        </div>
      )}
      {/* <div className="absolute top-8 right-4">
        <Image
          src={"/insta-logo.png"}
          width={40}
          height={40}
          alt="insta logo"
        />
      </div> */}
      <div className="absolute left-0 right-0 top-4 flex justify-center">
        <Image
          src={"/images/Logo Black.png"}
          width={200}
          height={70}
          alt="Logo"
        />
      </div>
      <div className="absolute h-[650px] sm:left-4 left-0  sm:right-10 right-8 top-32 ">
        {lastPost !== undefined && lastPost !== "" && (
          <img
            src={`${
              process.env.NEXT_PUBLIC_API_URL
            }/proxy-image/${encodeURIComponent(
              lastPost.url.replace(
                "https://cdn-image.notjustanalytics.com/",
                ""
              )
            )}`}
            alt="last post"
            className="object-cover rounded-lg m-4 w-full h-full "
          />
        )}
      </div>
      <div className="my-14" />
      <div className="">
        <div className="backdrop-blur-lg bg-white/60 shadow-lg sm:mx-0 mx-8 text-xl sm:text-2xl font-bold rounded-xl p-6 pt-6 text-center">
          Instagram Analytics
        </div>
        <div className="sm:my-16 my-10" />
        {profileData.profile_pic_url !== undefined ? (
          <ProfileReport
            profileData={profileData}
            updatedDetails={updatedDetails}
          />
        ) : (
          <div className="border backdrop-blur-lg bg-white/60 shadow-xl rounded-xl text-2xl font-bold p-6 ">
            {" "}
            Not able to generate the report{" "}
          </div>
        )}

        <div className="my-auto" />
      </div>
      {/* <Image
        src={"/bg-gradient.jpeg"}
        fill
        alt="background gradient"
        className="-z-50"
      /> */}
      {profileData !== undefined && followerData.history !== undefined && (
        <>
          <div className=" w-full flex flex-col items-center justify-center p-2 sm:p-8">
            {/* word cloud hastag  */}
            <div className="w-full">
              {profileData !== undefined &&
                profileData.hashtags !== undefined && (
                  <>
                    <div className="flex items-center justify-center mt-16 mb-8">
                      <div className=" text-2xl z-[1] font-semibold  p-4 relative">
                        User-Generated Hashtag Usage
                        <Image
                          src={"/Patch-1.png"}
                          fill
                          alt="text gradient"
                          className="-z-10 rounded-lg "
                        />
                      </div>
                    </div>
                    <div className="w-full flex print:flex-col my-8 print:h-full sm:h-[550px] gap-4 sm:flex-row flex-col">
                      <div className=" w-full  h-[550px]  border bg-white p-4 rounded-md">
                        <div className=" text-xl font-semibold">
                          Hastag as per interaction
                        </div>
                        <WordCloudChart hashtags={profileData.hashtags} />
                      </div>
                      <div className="w-full ">
                        <HashtagList hashtags={profileData.hashtags} />
                      </div>
                    </div>
                  </>
                )}
            </div>
            {/* Follower chart  */}
            {followerData.history !== undefined && (
              <>
                <div className="my-8" />
                <div className="w-full">
                  <div className="flex items-center justify-center">
                    <div className=" text-2xl z-[1] font-semibold  p-4 relative">
                      Overall Follower Expansion
                      <Image
                        src={"/Patch-1.png"}
                        fill
                        alt="text gradient"
                        className="-z-10 rounded-lg "
                      />
                    </div>
                  </div>
                  <div className="my-8" />
                  <LineChart followingData={followerData} />
                </div>
              </>
            )}

            <div className="w-full">
              <div className="flex items-center justify-center mt-16 mb-8">
                <div className=" text-2xl z-[1] font-semibold  p-4 relative">
                  Comprehensive Analysis of Your Follower Trends
                  <Image
                    src={"/Patch-1.png"}
                    fill
                    alt="text gradient"
                    className="-z-10 rounded-lg "
                  />
                </div>
              </div>
              {followerData.history !== undefined && (
                <div className="w-full grid grid-cols-6 gap-4 ">
                  <div className="col-span-6 print:col-span-6 sm:col-span-4">
                    <FollowerGrowthGraph
                      followerHistory={followerData.history}
                      isFollowing={true}
                    />
                  </div>
                  <div className="col-span-6 print:col-span-6 sm:col-span-2 ">
                    <FollowerGrowthOverview
                      followerHistory={followerData.history}
                    />
                  </div>
                </div>
              )}
            </div>
            {followerData.history !== undefined && (
              <div className="w-full">
                <ProfileDataHistory data={followerData.history} />
              </div>
            )}

            <>
              <div className="my-8" />
              <div className="w-full">
                <div className="flex justify-center">
                  <div className="text-xl  p-4 relative">
                    <div
                      className=" text-2xl z-[1] font-semibold  p-4 relative"
                      // style={{
                      //   background:
                      //     "linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(255,154,0,1) 100%)",
                      //   borderRadius: "8px", // Optional: to match the rounded corners
                      //   padding: "10px 20px", // Adjust padding as needed
                      //   display: "inline-block", // Ensure the background fits the text
                      // }}
                    >
                      Post Interactions Metrics
                      <Image
                        src={"/Patch-1.png"}
                        fill
                        alt="text gradient"
                        className="-z-10 rounded-lg "
                      />
                    </div>
                  </div>
                </div>
                {/* <BarChartWithImages /> */}
                {profileData.media !== undefined && (
                  <BarChart mediaData={profileData.media} />
                )}
              </div>

              <div className="w-full">
                {/* <PostAnalysisTable data={profileData.media} />; */}
                {profileData.media !== undefined && (
                  <PostAnalysis data={profileData.media} />
                )}
              </div>

              {/* <div>
              <WordCloudChart />
            </div> */}
            </>
          </div>
          <div className="fixed bottom-4 right-4">
            <button
              onClick={scrollToTop}
              className="p-2 bg-white text-white rounded-full shadow-lg hover:bg-white/70 transition-colors duration-300"
            >
              <MoveUp color="#000" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ShareLinkDialog = ({
  open,
  username,
  onClose,
}: {
  open: boolean;
  username: string;
  onClose: any;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={`${process.env.NEXT_PUBLIC_URL}/report/${username}`}
                readOnly
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_URL}/share/${username}`
                  );
                }}
              >
                Copy
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProfileAnalytics;
