"use client";
import formatNumber from "@/utils/formateNumber";
import Image from "next/image";
import GradientImage from "../../../../public/Patch-1.png";
import { TrendingDown, TrendingUp } from "lucide-react";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helper";
import getGrade from "@/utils/get_grade";

const ProfileReport = ({ profileData, updatedDetails }: any) => {
  console.log("updateDetails", updatedDetails);
  const gradeOrStatusValue =
    updatedDetails !== undefined &&
    updatedDetails["grade"] !== undefined &&
    updatedDetails["grade"] !== ""
      ? updatedDetails["grade"]
      : updatedDetails !== undefined &&
        updatedDetails["status"] !== undefined &&
        updatedDetails["status"] !== ""
      ? updatedDetails["status"]
      : getGrade(
          profileData.followers,
          parseInt(profileData["media_info"]["er_info"]["er"]) ?? 0
        );

  const isGradeA =
    gradeOrStatusValue &&
    (gradeOrStatusValue.toString().toLowerCase() === "a" ||
      gradeOrStatusValue.toString().toLowerCase() === "a+");

  const gradeTextColorClass = isGradeA ? "text-green-500" : "";
  return (
    <div
      id="profile-card"
      className="border backdrop-blur-lg bg-white/60 shadow-xl rounded-xl smx-0 mx-8 "
    >
      <div className="flex flex-col items-center justify-center  py-4 px-8 mx-4">
        {/* <Image
          src={"/Logo 1.png"}
          width={240}
          height={40}
          alt="Insta Analytics logo"
        /> */}

        <Image
          src={"/images/Logo Black.png"}
          width={160}
          height={60}
          alt="Logo"
        />
        <div className="flex flex-col gap-4 items-center justify-center">
          <img
            src={`${
              process.env.NEXT_PUBLIC_API_URL2
            }/proxy-image/${encodeURIComponent(
              profileData.profile_pic_url.replace(
                "https://cdn-image.notjustanalytics.com/",
                ""
              )
            )}`}
            // src={"https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/147254230_112165057532944_7401589615602879255_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_cat=1&_nc_ohc=cFiCzejQZoUQ7kNvgE6I-cW&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYA7znosEKzaCwX_IDQYM3iONCG6t3pNFzM3UkcoS07Qsw&oe=66C5EC63&_nc_sid=8b3546"}
            width={150}
            height={150}
            className="rounded-full shadow-md w-[150px] h-[150px]"
            alt={`${profileData.username}`}
          />
          <div className="font-bold">@{profileData.username}</div>
          {profileData.category_name !== "" &&
            profileData.category_name !== undefined &&
            profileData.category_name !== null && (
              <div className="bg-[#F5F6FA]/40 px-4 py-2 rounded-full font-medium my-4">
                {profileData.category_name}
              </div>
            )}
        </div>
        <div className="flex gap-4 justify-between my-4">
          <div className="flex flex-col items-center sm:w-24 w-16">
            <Image
              src={"/Followers.png"}
              width={40}
              height={40}
              alt="Followers"
            />
            <div className="font-bold">
              {formatNumber(profileData.followers.toString())}
            </div>
            <div className="sm:text-xs text-[8px] font-medium">Followers</div>
          </div>
          <div className="flex flex-col items-center  sm:w-24 w-16">
            <Image src={"/Likes.png"} width={40} height={40} alt="Avg Likes" />
            <div className="font-bold">
              {formatNumber(profileData.media_info.avg_like)}
            </div>
            <div className="sm:text-xs text-[8px] font-medium">Avg Likes</div>
          </div>
          <div className="flex flex-col items-center sm:w-24 w-16">
            <Image
              src={"/Comments Icon.png"}
              width={40}
              height={40}
              alt="Avg Comments"
            />
            <div className="font-bold">
              {formatNumber(profileData.media_info.avg_comments)}
            </div>
            <div className="sm:text-xs text-[8px] font-medium">
              Avg Comments
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col relative items-center justify-around mb-2 w-[calc(100%-16px)] h-[160px]  mx-2">
        <img
          src={GradientImage.src}
          className="absolute top-0 bottom-0 -z-10 w-[calc(100%-16px)] h-[160px]"
        />
        <div className="flex flex-row items-center justify-around  py-2 w-[calc(100%-16px)] h-[160px]">
          <div className="flex flex-col items-center justify-start gap-4">
            <div className="flex flex-col gap-1 items-start">
              <div className="text-3xl font-black">
                {updatedDetails !== undefined &&
                updatedDetails["enagementRate"] !== undefined &&
                updatedDetails["enagementRate"] !== ""
                  ? updatedDetails["enagementRate"]
                  : profileData.media_info.er_info.er}{" "}
                %
              </div>
              <div className="text-sm font-medium">Engagement Rate</div>
            </div>
            <div className="flex gap-2 mb-2 px-4 text-sm text-start">
              {parseInt(profileData.media_info.er_info.er_diff_avg) > 0 ? (
                <TrendingUp />
              ) : (
                <TrendingDown />
              )}
              {/* <b className="whitespace-nowrap w-min h-min">
                {updatedDetails !== undefined &&
                updatedDetails["enageChange"] !== undefined &&
                updatedDetails["enageChange"] !== ""
                  ? updatedDetails["enageChange"]
                  : profileData.media_info.er_info.er_diff_avg}
                %
              </b>{" "} */}
              {updatedDetails !== undefined &&
              updatedDetails["oneLinear"] !== undefined &&
              updatedDetails["oneLinear"] !== "" ? (
                updatedDetails["oneLinear"]
              ) : profileData.media_info.er_info.er_type === "good" ? (
                "higher than the average of similar profiles"
              ) : (
                <p>
                  Engagement rate of your profile is currently lower than <br />{" "}
                  the average for profiles in your niche.
                </p>
              )}
            </div>
          </div>
          <div
            className={`flex w-28 h-28 flex-col mr-4 justify-center items-center ${
              isGradeA
                ? "  bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-lg p-2"
                : "bg-gradient-to-tr from-[#F4A214] via-[#D63362]  to-[#7815AF] rounded-lg p-2"
            }`}
          >
            <div
              className={`text-[48px] text-white font-black ${gradeTextColorClass}`}
            >
              {capitalizeFirstLetterOfEachWord(gradeOrStatusValue)}
            </div>
            <div className="text-sm text-white font-medium">Grade</div>
          </div>
        </div>
      </div>
    </div>
  );
};
{
  /* <div
            className={`flex w-20 h-20 flex-col items-center ${
              isGradeA
                ? "border-2 border-transparent bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-lg p-2"
                : "border-2 border-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-lg p-2"
            }`}
          >
            <div
              className={`text-4xl text-white font-black ${gradeTextColorClass}`}
            >
              {capitalizeFirstLetterOfEachWord(gradeOrStatusValue)}
            </div>
            <div className="text-sm text-white font-medium">Grade</div>
          </div> */
}
export default ProfileReport;
