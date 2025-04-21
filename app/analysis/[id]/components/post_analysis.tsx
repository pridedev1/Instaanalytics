// src/components/PostAnalysisTable.js
"use client";
// src/components/PostAnalysisTable.js
import React from "react";
import Image from "next/image";
import { format } from "light-date";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { isMobile } from "react-device-detect";
import { formatNumber } from "@/utils/helper";
import UserNameMark from "./user_name_mark";

const PostAnalysisGrid = ({ data }: any) => {
  return (
    <div className="w-full mx-auto my-16">
      <h2 className="flex justify-center mb-8 ">
        <div className="text-2xl z-[1] p-4 w-max font-bold relative">
          Recent 12 Post Activity
          <Image
            src={"/Patch-1.png"}
            fill
            alt="text gradient"
            className="-z-10 rounded-lg "
          />
        </div>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 bg-white rounded-lg p-2">
        {data.map((post: any) => (
          <div key={post.id} className="border p-2 rounded-md">
            <div className="relative w-full pb-full">
              {/* <Image
                src={post.url.replace(
                  "https://cdn-image.notjustanalytics.com/",
                  ""
                )}
                alt={post.caption}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              /> */}
              <img
                src={`${
                  process.env.NEXT_PUBLIC_API_URL2
                }/proxy-image/${encodeURIComponent(
                  post.url.replace(
                    "https://cdn-image.notjustanalytics.com/",
                    ""
                  )
                )}`}
                alt={post.caption}
                // layout="responsive"
                // objectFit="fill"
                // width={120}
                // height={120}
                className="rounded-md aspect-square object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-lg  p-1 rounded-full">
                {post["media_type"] === "GraphSidecar" && (
                  <div>
                    <Image
                      src={"/carosuel.svg"}
                      width={30}
                      height={30}
                      alt="reel"
                      className="p-1.5 "
                    />
                  </div>
                )}
                {post["media_type"] === "GraphImage" && (
                  <div>
                    <Image
                      src={"/gallary.svg"}
                      width={30}
                      height={30}
                      alt="reel"
                      className="p-1.5 "
                    />
                  </div>
                )}
                {post.is_reel_media && (
                  <div>
                    <Image
                      src={"/reel.svg"}
                      width={30}
                      height={30}
                      alt="reel"
                      className="p-1.5 "
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex sm:flex-row flex-col items-start gap-2 justify-between mt-2">
              <div className="flex items-center gap-1">
                <Heart size={18} />
                <span className=" pr-2">
                  {post.total_likes.toLocaleString().replace(",", ".")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={18} />
                <span className=" pr-2">
                  {post.total_comments.toLocaleString().replace(",", ".")}
                </span>
              </div>
              {post.is_reel_media && (
                <div className="flex gap-2 items-center">
                  <Eye size={20} />{" "}
                  {formatNumber(
                    post.total_video_views.toLocaleString()
                  ).replace(",", ".")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PostAnalysisTable = ({ data }: any) => {
  return (
    <div className="w-full mx-auto my-16 ">
      <h2 className="flex justify-center mb-8">
        <div className="text-2xl z-[1] font-bold p-4 w-max relative">
          Detailed Post Evaluation
          <Image
            src={"/Patch-1.png"}
            fill
            alt="text gradient"
            className="-z-10 rounded-lg "
          />
        </div>
      </h2>
      <div className="bg-white p-2 rounded-lg my-2 overflow-auto">
        <table className="min-w-full border-collapse  rounded-md">
          <thead>
            <tr>
              <th className="border p-2 text-left bg-gray-100 font-bold">
                Date & format
              </th>
              <th className="border p-2 text-left bg-gray-100 font-bold">
                Posts
              </th>
              <th className="border p-2 text-left bg-gray-100 font-bold">
                Interactions
              </th>
              <th className="border p-2 text-left bg-gray-100 font-bold">
                Mentions & tags
              </th>
              <th className="border p-2 text-left bg-gray-100 font-bold">
                Hashtags
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((post: any) => (
              <tr key={post.id}>
                <td className="border p-2">
                  <div>
                    {format(
                      new Date(post.timestamp * 1000),
                      "{MM}/{dd}/{yyyy} {HH}:{mm}:{ss}"
                    )}
                  </div>
                  <div className="pt-1">
                    {post["media_type"] === "GraphSidecar" && (
                      <div>
                        <Image
                          src={"/carosuel.svg"}
                          width={30}
                          height={30}
                          alt="reel"
                          className="p-1.5 bg-[#55A2F5] rounded-full text-white"
                        />
                      </div>
                    )}
                    {post["media_type"] === "GraphImage" && (
                      <div>
                        <Image
                          src={"/gallary.svg"}
                          width={30}
                          height={30}
                          alt="Photo"
                          className="p-1.5 bg-[#55A2F5] rounded-full text-white"
                        />
                      </div>
                    )}
                    {post.is_reel_media && (
                      <div>
                        <Image
                          src={"/reel.svg"}
                          width={30}
                          height={30}
                          alt="reel"
                          className="p-1.5 bg-[#D533ED] rounded-full text-white"
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="border p-2">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_API_URL2
                    }/proxy-image/${encodeURIComponent(
                      post.url.replace(
                        "https://cdn-image.notjustanalytics.com/",
                        ""
                      )
                    )}`}
                    alt={post.caption}
                    width={60}
                    height={60}
                    className="rounded-md w-[60px] h-[60px]"
                  />
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 items-center">
                    <Heart size={20} />{" "}
                    {post.total_likes.toLocaleString().replace(",", ".")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <MessageCircle size={20} />{" "}
                    {post.total_comments.toLocaleString().replace(",", ".")}
                  </div>
                  {post.is_reel_media && (
                    <div className="flex gap-2 items-center">
                      <Eye size={20} />{" "}
                      {post.total_video_views
                        .toLocaleString()
                        .replace(",", ".")}
                    </div>
                  )}
                </td>
                <td className="border p-2">
                  {post.mentions.length > 0 ? post.mentions.join(", ") : "None"}
                </td>
                <td className="border p-2">
                  {post.hashtag.map((tag: any) => (
                    <div key={tag}>{tag}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PostAnalysis = ({ data, profileData, print }: any) => {
  // if (isMobile)
  return (
    <div>
      <div className="profile-item ">
        {print && (
          <div className="relative ">
            <UserNameMark profileData={profileData} />
          </div>
        )}
        <PostAnalysisGrid data={data} />
      </div>

      <div className="profile-item">
        {print && (
          <div className="relative mb-4">
            <UserNameMark profileData={profileData} />
          </div>
        )}
        <PostAnalysisTable data={data} />
      </div>
    </div>
  );
};

export default PostAnalysis;
