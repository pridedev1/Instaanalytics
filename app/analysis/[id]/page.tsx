"use client";

import LineChart from "./components/line_chart";
import Image from "next/image";
import ProfileReport from "./components/profile_report";
import BarChart from "./components/bar-chart";
import { useEffect, useState } from "react";
import { Loader2, MoveUp } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import PostAnalysis from "./components/post_analysis";
import ProfileDataHistory from "./components/porfile_data_history";
import WordCloudChart from "./components/word_cloud_chart";
import HashtagList from "./components/hash_tag_list";
import FollowerGrowthGraph from "./components/follower_growth_graph";
import FollowerGrowthOverview from "./components/follower_growth_overview";

const ProfileAnalysis = () => {
  const [profileData, setProfileData] = useState<any>();
  const [followerData, setFollowerData] = useState<any>();
  const [loading, setLoading] = useState(false);
  let { id } = useParams();

  const fetchData = async (id: string) => {
    try {
      setLoading(true);
      let res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile-report?username=${id}`
      );
      let data = res.data;
      console.log("data ;", data);

      if (!data["success"]) throw "Unable to get the report";
      // setFollowerData({});
      // setProfileData({});
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
  };

  useEffect(() => {
    fetchData(id as string);
    console.log("loafing data");
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const profileData = sampleResponse.profileData;
  // const followerData = sampleResponse.followingData;
  // console.log("following data :", followerData);

  if (profileData === undefined || followerData === undefined)
    return (
      <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
        <div className="m-4 text-center">
          InstaAnalyser is carefully analyzing your profile. Please be patient.
        </div>
      </div>
    );

  let lastPost =
    profileData.media != undefined && profileData.media.length != 0
      ? profileData.media[0]
      : undefined;
  return (
    <div className="flex flex-col bg_gradient items-center justify-center relative   bg-no-repeat bg-fixed bg-cover">
      {/* <div className="absolute top-8 right-4">
        <Image
          src={"/insta-logo.png"}
          width={40}
          height={40}
          alt="insta logo"
        />
      </div> */}
      <div className="absolute left-0 right-0 top-4 flex justify-center">
        <Image src={"/Logo Black.png"} width={200} height={70} alt="Logo" />
      </div>
      <div className="absolute h-[650px] sm:left-4 left-0  sm:right-10 right-8 top-32 ">
        {lastPost !== undefined && lastPost !== "" && (
          <Image
            src={lastPost.url.replace(
              "https://cdn-image.notjustanalytics.com/",
              ""
            )}
            alt="last post"
            fill
            className="object-cover rounded-lg m-4 w-[90%]"
          />
        )}
      </div>
      <div className="my-14" />
      <div className="">
        <div className="backdrop-blur-lg bg-white/60 shadow-lg sm:mx-0 mx-8 text-xl sm:text-2xl font-bold rounded-xl p-6 pt-6 text-center">
          • Instagram Analytics •
        </div>
        <div className="sm:my-16 my-10" />
        {profileData.profile_pic_url !== undefined ? (
          <ProfileReport profileData={profileData} />
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
      <div className=" w-full flex flex-col items-center justify-center p-2 sm:p-8">
        {followerData.history !== undefined && (
          <>
            <div className="my-8" />
            <div className="w-full">
              <div className="flex items-center justify-center">
                <div
                  className=" text-2xl font-semibold  p-4 relative"
                  // style={{
                  //   background:
                  //     "linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(255,154,0,1) 100%)",
                  //   borderRadius: "8px", // Optional: to match the rounded corners
                  //   padding: "10px 20px", // Adjust padding as needed
                  //   display: "inline-block", // Ensure the background fits the text
                  // }}
                >
                  • Overall Follower Expansion •
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
        <div className="w-full flex my-8 sm:h-[550px] gap-4">
          <div className=" w-full  border bg-white p-4 rounded-md">
            <div className=" text-xl font-semibold">
              Hastag as per interaction
            </div>
            <WordCloudChart hashtags={profileData.hashtags} />
          </div>
          <div className="w-full ">
            <HashtagList hashtags={profileData.hashtags} />
          </div>
        </div>

        <div className="w-full grid grid-cols-6 gap-4 ">
          <div className="col-span-4">
            <FollowerGrowthGraph
              followerHistory={followerData.history}
              isFollowing={true}
            />
          </div>
          <div className="col-span-2 ">
            <FollowerGrowthOverview followerHistory={followerData.history} />
          </div>
        </div>
        {profileData.media !== undefined && (
          <>
            <div className="my-8" />
            <div className="w-full">
              <div className="flex justify-center">
                <div className="text-xl  p-4 relative">
                  <div
                    className=" text-2xl font-semibold  p-4 relative"
                    // style={{
                    //   background:
                    //     "linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(255,154,0,1) 100%)",
                    //   borderRadius: "8px", // Optional: to match the rounded corners
                    //   padding: "10px 20px", // Adjust padding as needed
                    //   display: "inline-block", // Ensure the background fits the text
                    // }}
                  >
                    • Post Interactions Metrics •
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
              <BarChart mediaData={profileData.media} />
            </div>

            <div className="w-full">
              {/* <PostAnalysisTable data={profileData.media} />; */}
              <PostAnalysis data={profileData.media} />
            </div>

            {/* <div>
              <WordCloudChart />
            </div> */}
            <div className="w-full">
              <ProfileDataHistory
                data={followerData.history.slice(-30).reverse()}
              />
            </div>
          </>
        )}
      </div>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={scrollToTop}
          className="p-2 bg-white text-white rounded-full shadow-lg hover:bg-white/70 transition-colors duration-300"
        >
          <MoveUp color="#000" />
        </button>
      </div>
    </div>
  );
};

export default ProfileAnalysis;
