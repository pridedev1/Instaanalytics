"use client";

import LineChart from "./components/line_chart";
import Image from "next/image";
import ProfileReport from "./components/profile_report";
import BarChart from "./components/bar-chart";
import { useEffect, useState } from "react";
import {
  File,
  FileImage,
  Images,
  Loader2,
  MoveUp,
  Share2,
  Video,
  Menu,
  X,
} from "lucide-react";
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
import { errorToast, successToast } from "@/utils/toast";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserNameMark from "./components/user_name_mark";
import useWindowDimensions from "@/utils/hooks/useWindownSize";

const ProfileAnalytics = ({
  preview = false,
  print = false,
  profileD,
  followingD,
  updatedD = {},
}: {
  preview?: boolean;
  print?: boolean;
  profileD?: any;
  followingD?: any;
  updatedD?: any;
}) => {
  const [profileData, setProfileData] = useState<any>(profileD);
  const [followerData, setFollowerData] = useState<any>(followingD);
  const [loading, setLoading] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingVideo, generatingVideoSet] = useState(false);
  const [generatingLongImage, setGeneratingLongImage] = useState(false);

  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  let { id } = useParams();

  const [updatedDetails, setUpdatedDetials] = useState<any>(updatedD);
  let searchParams = useSearchParams();

  // Mobile popup state
  const [mobilePopupOpen, setMobilePopupOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // 768px is typical mobile breakpoint

  const fetchData = async (id: string) => {
    setLoading(true);
    const maxRetries = 2; // Maximum number of retries
    let attempt = 0;

    // Helper function to check if data is valid (not empty objects)
    const isValidData = (profile: any, follower: any): boolean => {
      const profileValid =
        profile &&
        typeof profile === "object" &&
        Object.keys(profile).length > 0;
      const followerValid =
        follower &&
        typeof follower === "object" &&
        Object.keys(follower).length > 0;
      // Add more specific checks if needed, e.g., follower.history
      // const followerHistoryValid = followerValid && follower.history && follower.history.length > 0;
      return profileValid && followerValid; // && followerHistoryValid;
    };

    // Check if it exists in our database (only once)
    const accountRef = doc(db, `/accounts/${id}`);
    let d = await getDoc(accountRef);
    if (d.exists()) {
      setUpdatedDetials(d.data());
    }

    while (attempt <= maxRetries) {
      try {
        let via = searchParams.get("via");
        let backednUrl = process.env.NEXT_PUBLIC_API_URL2?.includes(
          "http://localhost:3001"
        )
          ? `${process.env.NEXT_PUBLIC_API_URL2}/profile-report2?username=${id}`
          : `${process.env.NEXT_PUBLIC_API_URL2}/profile-report2?username=${id}`;

        // ... existing URL construction logic based on 'via' ...
        if (via === "test") {
          backednUrl = `${
            process.env.NEXT_PUBLIC_API_URL2
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
        // ... end of existing URL construction logic ...

        console.log(`Attempt ${attempt + 1}: Fetching data from ${backednUrl}`);
        let res = await axios.get(backednUrl);
        let data = res.data;

        if (!data["success"]) {
          throw new Error("API indicated failure: Unable to get the report");
        }

        const profile = data["profileData"];
        const follower = data["followingData"];

        if (isValidData(profile, follower)) {
          setFollowerData(follower);
          setProfileData(profile);
          setSuccess(true); // Mark as success to exit the loop
          console.log(`Attempt ${attempt + 1}: Success`);
          break; // Exit the loop immediately on success
        } else {
          throw new Error(
            "API returned success, but data is invalid or empty."
          );
        }
      } catch (error) {
        console.log(`Attempt ${attempt + 1} failed:`, error);
        attempt++; // Increment attempt counter

        if (attempt > maxRetries) {
          // errorToast("Failed to fetch profile report after multiple attempts.");
          console.log(
            "error in getting profile report after multiple attempts:",
            error
          );
          setFollowerData({});
          setProfileData({});
          break; // Exit the loop when max retries reached
        } else {
          // Optional: Add a delay before retrying
          console.log(`Waiting before retry attempt ${attempt + 1}...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff (1s, 2s)
        }
      }
    } // end while loop

    setLoading(false); // Set loading to false after all attempts or success
  };

  const shareAbleLink = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }
    setSharing(true);
    try {
      const userRef = doc(db, `/share/${id}`);
      let d = {
        username: id,
        userId: user!.id,
        userEmail: user!.email,
        createdAt: new Date(),
        profileData: profileData,
        followingData: followerData,
      };
      console.log("data :", d, id);

      await setDoc(userRef, d, { merge: true });

      setShowShareLink(true);
    } catch (error) {
      errorToast("Unable to share");
      console.log("error in sharing :", error);
    } finally {
      setSharing(false);
    }
  };
  const cacheAccount = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }
    try {
      const userRef = doc(db, `/accounts/${id}`);
      await setDoc(
        userRef,
        {
          cache: {
            profileData: profileData,
            followingData: followerData,
            createdAt: new Date(),
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.log("unable to process :", error);
      throw error;
    }
  };
  const downloadPdf = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }
    setGeneratingPdf(true);
    try {
      await cacheAccount();

      // Download PDF from API
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL2}/pdf?username=${id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob from response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${id}_report.pdf`);

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error in downloading :", error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const downloadImage = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }
    setGeneratingImage(true);
    try {
      await cacheAccount();

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL2}/report-images?username=${id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob from response and download as zip
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${id}_report_images.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error in downloading :", error);
    } finally {
      setGeneratingImage(false);
    }
  };
  const downloadVideo = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }
    generatingVideoSet(true);
    try {
      await cacheAccount();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/report-video?username=${id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob from response and download video
      const blob = new Blob([response.data], { type: "video/mp4" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${id}_report_video.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error in downloading :", error);
    } finally {
      generatingVideoSet(false);
    }
  };

  const downloadLongImage = async () => {
    if (user === undefined) {
      errorToast("Please login to share");
      return;
    }
    try {
      setGeneratingLongImage(true);
      await cacheAccount();

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL2}/long-screenshot?username=${id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob from response and download as zip
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${id}_report_long_image.jpeg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error in downloading :", error);
    } finally {
      setGeneratingLongImage(false);
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

    if (!isAuthenticated && !preview) {
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
    // console.log("loafing data");
  }, []);
  // console.log("profile data :", profileData);
  // console.log("follower data :", followerData);

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
    <div
      id="analytic-report"
      className="flex flex-col items-center justify-center relative bg-no-repeat bg-fixed bg-cover"
    >
      {/* Add print button */}
      <ShareLinkDialog
        open={showShareLink}
        username={id as any}
        onClose={() => setShowShareLink(false)}
      />{" "}
      {!preview && (
        <>
          {/* Desktop View - Keep as is */}
          <div className="hidden md:flex fixed gap-2 top-4 right-4 print:hidden z-50">
            <Button variant={"outline"} onClick={downloadImage}>
              {generatingImage ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <Images />
                  Images
                </>
              )}
            </Button>
            <Button variant={"outline"} onClick={downloadVideo}>
              {generatingVideo ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <Video />
                  Video
                </>
              )}
            </Button>
            <Button variant={"outline"} onClick={shareAbleLink}>
              {sharing ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <Share2 />
                  Share
                </>
              )}
            </Button>
          </div>

          {/* Mobile View - Popup */}
          <div className="md:hidden fixed top-4 right-4 print:hidden z-50">
            <Popover open={mobilePopupOpen} onOpenChange={setMobilePopupOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-lg bg-white/90 backdrop-blur-sm"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-4 space-y-3 bg-white/95 backdrop-blur-sm border-0 shadow-xl"
                align="end"
                side="bottom"
                sideOffset={8}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Actions</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setMobilePopupOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => {
                    downloadImage();
                    setMobilePopupOpen(false);
                  }}
                >
                  {generatingImage ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Images className="w-4 h-4" />
                  )}
                  Download Images
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => {
                    downloadVideo();
                    setMobilePopupOpen(false);
                  }}
                >
                  {generatingVideo ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  Download Video
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => {
                    shareAbleLink();
                    setMobilePopupOpen(false);
                  }}
                >
                  {sharing ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  Share Report
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </>
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
      <div className="my-14" />
      {/* profile report  */}
      <div className="profile-item">
        <div className=" absolute h-[650px] sm:left-4 left-0  sm:right-10 right-8 top-32 ">
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
        {print && <UserNameMark profileData={profileData} />}
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
                  <div className="profile-item relative">
                    {print && <UserNameMark profileData={profileData} />}
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
                    <div className=" w-full flex print:flex-col my-8 print:h-full sm:h-[550px] gap-4 sm:flex-row flex-col">
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
                  </div>
                )}
            </div>
            {/* Follower chart  */}
            {followerData.history !== undefined && (
              <>
                <div className="my-8" />
                <div className="profile-item relative w-full">
                  {print && <UserNameMark profileData={profileData} />}
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

            <div className="profile-item relative w-full">
              {print && <UserNameMark profileData={profileData} />}
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
                <div className=" w-full grid grid-cols-6 gap-4 ">
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
              <div className="profile-item relative w-full">
                {print && <UserNameMark profileData={profileData} />}
                <ProfileDataHistory data={followerData.history} />
              </div>
            )}

            <>
              <div className="my-8" />
              <div className="profile-item relative w-full">
                {print && <UserNameMark profileData={profileData} />}
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
                  <div className=" ">
                    <BarChart mediaData={profileData.media} />
                  </div>
                )}
              </div>

              <div className="w-full">
                {/* <PostAnalysisTable data={profileData.media} />; */}
                {profileData.media !== undefined && (
                  <PostAnalysis
                    data={profileData.media}
                    profileData={profileData}
                    print={print}
                  />
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
      <div id="end-report" />
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
                    `${process.env.NEXT_PUBLIC_URL}/report/${username}`
                  );
                  successToast("link copied");
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
