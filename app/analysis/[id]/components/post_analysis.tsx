// src/components/PostAnalysisTable.js
"use client";
// src/components/PostAnalysisTable.js
import React from "react";
import Image from "next/image";
import { format } from "light-date";
import { Eye, Heart, MessageCircle } from "lucide-react";

const PostAnalysisTable = ({ data }: any) => {
  return (
    <div className="w-full mx-auto my-8">
      <h2 className="text-left mb-4 text-2xl font-bold">
        Detailed post analysis
      </h2>
      <table className="min-w-full border-collapse rounded-md">
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
              </td>
              <td className="border p-2">
                <Image
                  src={post.url.replace(
                    "https://cdn-image.notjustanalytics.com/",
                    ""
                  )}
                  alt={post.caption}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
              </td>
              <td className="border p-2">
                <div className="flex gap-2 items-center">
                  <Heart color="#AEB2C2" size={20} />{" "}
                  {post.total_likes.toLocaleString()}
                </div>
                <div className="flex gap-2 items-center">
                  <MessageCircle color="#AEB2C2" size={20} />{" "}
                  {post.total_comments.toLocaleString()}
                </div>
                <div className="flex gap-2 items-center">
                  <Eye color="#AEB2C2" size={20} />{" "}
                  {post.total_video_views.toLocaleString()}
                </div>
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
  );
};

export default PostAnalysisTable;
