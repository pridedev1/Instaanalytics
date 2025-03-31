"use client";
import convertInstagramNumber from "@/utils/convertInstgramNumber";
import formatNumber from "@/utils/formateNumber";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import GradientImage from "../../../public/Patch-1.png";

const Analytics = () => {
  let { id } = useParams();
  const searchParams = useSearchParams();

  let d = searchParams.get("data") as string;
  console.log("ddd :", d);

  const data = JSON.parse(d === "" || d === undefined ? "{}" : d);

  const { avgLikes, avgComments } =
    data["post_info"] !== undefined && data["post_info"].length !== 0
      ? (data["post_info"] as any[]).reduce(
          (acc, post, _, { length }: any) => {
            return {
              avgLikes:
                acc.avgLikes + convertInstagramNumber(post.like_count) / length,
              avgComments:
                acc.avgComments +
                convertInstagramNumber(post.comment_count) / length,
            };
          },
          { avgLikes: 0, avgComments: 0 }
        )
      : { avgLikes: 0, avgComments: 0 };
  const enageRate =
    ((avgLikes + avgComments) /
      convertInstagramNumber(data["follower_count"])) *
    100;
  // console.log(
  //   "data :",
  //   data,
  //   avgComments,
  //   avgLikes,
  //   convertInstagramNumber(data["follower_count"]),
  //   enageRate
  // );
  useEffect(() => {}, [searchParams]);

  return (
    <div className="flex flex-col  items-center justify-center bg-[url('/bg_image/business-desktop.jpeg')]  h-screen bg-no-repeat bg-fixed bg-cover">
      <div className="backdrop-blur-lg bg-white/60 shadow-lg text-xl sm:text-2xl font-bold rounded-b-xl p-6 pt-10">
        INSTAGRAM REPORT
      </div>
      <div className="my-auto" />
      <div className="border backdrop-blur-lg bg-white/60 shadow-xl rounded-xl ">
        <div className="flex flex-col items-center justify-center  py-4 px-8 mx-4">
          <Image
            src={"/Logo 1.png"}
            width={240}
            height={40}
            alt="Insta Analytics logo"
          />

          <div className="flex flex-col gap-4 items-center justify-center">
            <Image
              src={data["profile_pic"]}
              width={150}
              height={150}
              className="rounded-full shadow-md"
              alt={`${id}`}
            />
            <div className="font-bold">@{id}</div>
          </div>

          <div className="flex gap-4 justify-between my-4">
            <div className="flex flex-col items-center sm:w-24 w-16">
              <Image
                src={"/Followers.png"}
                width={40}
                height={40}
                alt="Followers"
              />
              <div className="font-bold">{data["follower_count"]}</div>
              <div className="sm:text-xs text-[8px] font-medium">Followers</div>
            </div>
            <div className="flex flex-col items-center  sm:w-24 w-16">
              <Image
                src={"/Likes.png"}
                width={40}
                height={40}
                alt="Avg Likes"
              />
              <div className="font-bold">
                {formatNumber(Number(avgLikes.toFixed(0)))}
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
                {formatNumber(Number(avgComments.toFixed(0)))}
              </div>
              <div className="sm:text-xs text-[8px] font-medium">
                Avg Comments
              </div>
            </div>
          </div>

          {/* <div className="font-bold text-2xl text-center">
          Instagram Report for {id}
        </div> */}
        </div>

        <div className="flex flex-row relative items-center justify-around mb-2 w-[calc(100%-16px)] h-28 mx-2">
          <img
            src={GradientImage.src}
            className="absolute top-0 bottom-0 -z-10"
          />
          <div className="flex flex-col items-center">
            <div className="text-3xl font-black">
              {Number(enageRate.toFixed(1))}%
            </div>
            <div className="text-sm font-medium">Engagement Rate</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-black">{"Low"}</div>
            <div className="text-sm font-medium">Status</div>
          </div>
        </div>

        {/* <div className="flex flex-col sm:flex-row gap-8 py-4 ">≥ */}
        {/* <div>
              
              
              <div className="border-b-[1px] border-b-black mb-4" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end gap-2">
                  <div className="font-bold">Engagement Rate</div>
                  <div className="text-2xl font-black text-red-400">
                    {Number(enageRate.toFixed(1))}%
                  </div>
                </div>
                <div className="flex justify-between items-end gap-2">
                  <div className="font-bold">status</div>
                  <div className="font-black text-2xl text-red-400">
              
                  </div>
                </div>
              </div>
            </div> */}
        {/* </div> */}
      </div>
      <div className="my-auto" />
    </div>
  );
};

export default Analytics;
