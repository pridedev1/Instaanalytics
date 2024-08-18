"use client";

import { sampleResponse } from "@/app/utils/constants";

import LineChart from "./components/line_chart";

import ProfileReport from "./components/profile_report";
import BarChart from "./components/bar-chart";
import PostAnalysisTable from "./components/post_analysis";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import { errorToast } from "@/app/utils/toast";

const ProfileAnalysis = () => {
  const [profileData, setProfileData] = useState<any>();
  const [followerData, setFollowerData] = useState<any>();

  let { id } = useParams();

  const fetchData = async (id: string) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchData(id as string);
  }, [id]);

  // const profileData = sampleResponse.profileData;
  // const followerData = sampleResponse.followingData;

  if (profileData === undefined || followerData === undefined)
    return (
      <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
        <div>loading might take few seconds</div>
      </div>
    );
  return (
    <div className="flex flex-col  items-center justify-center bg-[url('/bg_image/business-desktop.jpeg')]   bg-no-repeat bg-fixed bg-cover">
      <div className="h-screen">
        <div className="backdrop-blur-lg bg-white/60 shadow-lg text-xl sm:text-2xl font-bold rounded-b-xl p-6 pt-10 text-center">
          • INSTAGRAM REPORT •
        </div>
        <div className="sm:my-28 my-10" />
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
      <div className="bg-white w-full flex flex-col items-center justify-center p-8">
        {/* <div className="sm:w-[500px] w-full h-56  sm:h-[500px] border bg-white p-4 rounded-md">
          <div className=" text-xl font-semibold">
          Hastag as per interaction
          </div>
          <WordCloudChart />
          </div> */}
        {followerData.history !== undefined && (
          <>
            <div className="my-4" />
            <div className="w-full">
              <div className=" text-xl font-semibold py-4">
                Total Followers growth
              </div>

              <LineChart followingData={followerData} />
            </div>
          </>
        )}

        {profileData.media !== undefined && (
          <>
            <div className="my-4" />
            <div className="w-full">
              <div className=" text-xl font-semibold py-4">
                Post Interactions
              </div>
              {/* <BarChartWithImages /> */}
              <BarChart mediaData={profileData.media} />
            </div>
            <div className="w-full">
              <PostAnalysisTable data={profileData.media} />;
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileAnalysis;
