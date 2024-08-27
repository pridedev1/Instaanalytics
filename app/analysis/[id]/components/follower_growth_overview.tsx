"use client";
import React from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  parseISO,
  differenceInDays,
} from "date-fns";

const sampleResponse = {
  followingData: {
    history: [
      {
        follower: 16135934,
        following: 167,
        post: 899,
        date: "2024-08-22",
        newFollower: 4154,
        newFollowing: 0,
        newPost: 0,
      },
      {
        follower: 16131780,
        following: 167,
        post: 899,
        point: "8.09",
        date: "2024-08-21",
        newFollower: 0,
        newFollowing: 0,
        newPost: 0,
      },
      {
        follower: 16131780,
        following: 167,
        post: 899,
        point: "8.08",
        date: "2024-08-20",
        newFollower: -405,
        newFollowing: 0,
        newPost: 0,
      },
      {
        follower: 16132185,
        following: 167,
        post: 899,
        point: "8.05",
        date: "2024-08-19",
        newFollower: -1397,
        newFollowing: 0,
        newPost: 1,
      },
      {
        follower: 16133582,
        following: 167,
        post: 898,
        point: "8.04",
        date: "2024-08-18",
        newFollower: 444,
        newFollowing: 0,
        newPost: 0,
      },
      {
        follower: 16133138,
        following: 167,
        post: 898,
        point: "9.04",
        date: "2024-08-17",
        newFollower: 5,
        newFollowing: 0,
        newPost: 0,
      },
    ],
  },
};

const FollowerGrowthOverview = ({ followerHistory }: any) => {
  const data = sampleResponse.followingData.history;

  let thisWeekData = followerHistory.slice(0, 6);
  console.log("this week :", thisWeekData);

  let previousWeekData2 = followerHistory.slice(6, 14);
  console.log("previous week data :", previousWeekData2);

  // Calculate the current week range
  const currentDate = parseISO(data[0].date);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Calculate the previous week range
  const previousWeekStart = startOfWeek(
    new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000),
    { weekStartsOn: 1 }
  );
  const previousWeekEnd = endOfWeek(
    new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000),
    { weekStartsOn: 1 }
  );

  // Filter data for the current and previous week
  const currentWeekData = data.filter((d) => {
    const date = parseISO(d.date);
    return date >= weekStart && date <= weekEnd;
  });

  const previousWeekData = data.filter((d) => {
    const date = parseISO(d.date);
    return date >= previousWeekStart && date <= previousWeekEnd;
  });

  // Calculate totals
  const totalNewFollowersCurrentWeek = thisWeekData.reduce(
    (acc: any, d: any) => acc + d.newFollower,
    0
  );
  const totalNewFollowersPreviousWeek = previousWeekData2.reduce(
    (acc: any, d: any) => acc + d.newFollower,
    0
  );

  const totalNewFollowingCurrentWeek = thisWeekData.reduce(
    (acc: any, d: any) => acc + d.newFollowing,
    0
  );
  const totalNewFollowingPreviousWeek = previousWeekData2.reduce(
    (acc: any, d: any) => acc + d.newFollowing,
    0
  );

  const totalNewPostsCurrentWeek = thisWeekData.reduce(
    (acc: any, d: any) => acc + d.newPost,
    0
  );
  const totalNewPostsPreviousWeek = previousWeekData2.reduce(
    (acc: any, d: any) => acc + d.newPost,
    0
  );

  // Calculate average followers per day
  // const daysInWeek = differenceInDays(weekEnd, weekStart) + 1;
  const averageFollowersPerDay = totalNewFollowersCurrentWeek / 6;

  const bgColore = (value: any) => {
    console.log("following :", value, typeof value);

    if (value === 0) {
      return "";
    } else if (value > 0) {
      return "bg-green-50 text-green-500";
    } else if (value < 0) {
      return "bg-red-50  text-red-400 ";
    }
  };

  return (
    <div className="h-full bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold px-6 pt-6">Weekly Overview</h2>
        {/* <div>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-md mr-2">
            Week
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            Month
          </button>
        </div> */}
      </div>
      <div className="text-gray-500 mb-6 text-center text-sm font-semibold py-4 bg-gray-100 ">
        {format(weekStart, "dd/MM/yyyy")} - {format(weekEnd, "dd/MM/yyyy")}
      </div>
      <div className="space-y-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Followers</h3>
            <div className="text-xs text-gray-500 font-medium">
              {totalNewFollowersCurrentWeek - totalNewFollowersPreviousWeek} vs{" "}
              {format(previousWeekStart, "dd/MM")} -{" "}
              {format(previousWeekEnd, "dd/MM")}
            </div>
          </div>
          <div
            className={`${bgColore(
              totalNewFollowersCurrentWeek
            )} p-2 font-bold rounded-md`}
          >
            {" "}
            {totalNewFollowersCurrentWeek > 0 && "+"}
            {""}
            {totalNewFollowersCurrentWeek}
          </div>
        </div>
        <div className="border my-2" />
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Following</h3>
            <div className="text-xs text-gray-500 font-medium">
              {totalNewFollowingCurrentWeek - totalNewFollowingPreviousWeek} vs{" "}
              {format(previousWeekStart, "dd/MM")} -{" "}
              {format(previousWeekEnd, "dd/MM")}
            </div>
          </div>
          <div
            className={`${bgColore(
              totalNewFollowingCurrentWeek
            )}  p-2 font-bold rounded-md`}
          >
            {totalNewFollowingCurrentWeek > 0 && "+"}
            {totalNewFollowingCurrentWeek}
          </div>
        </div>
        <div className="border my-2" />
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Posts</h3>
            <div className="text-xs text-gray-500 font-medium">
              {totalNewPostsCurrentWeek - totalNewPostsPreviousWeek} vs{" "}
              {format(previousWeekStart, "dd/MM")} -{" "}
              {format(previousWeekEnd, "dd/MM")}
            </div>
          </div>
          <div
            className={`${bgColore(
              totalNewPostsCurrentWeek
            )} p-2 font-bold rounded-md`}
          >
            {totalNewPostsCurrentWeek > 0 && "+"}
            {totalNewPostsCurrentWeek}
          </div>
        </div>
      </div>
      <div
        className={`
          ${averageFollowersPerDay > 0 ? "text-green-50" : "text-red-50"}
           ${averageFollowersPerDay > 0 ? " bg-green-100/50" : " bg-red-100/50"}
      py-8 mt-4 rounded-lg text-center flex flex-col mx-6 mb-6 justify-center items-center`}
      >
        <h3
          className={` ${
            averageFollowersPerDay > 0 ? "text-green-500" : "text-red-500"
          } text-2xl font-bold`}
        >
          {averageFollowersPerDay > 0 && "+"}
          {averageFollowersPerDay.toFixed(0)}
        </h3>
        <div
          className={` ${
            averageFollowersPerDay > 0 ? "text-green-500" : "text-red-500"
          } text-sm font-medium`}
        >
          Average followers per day
        </div>
      </div>
    </div>
  );
};

export default FollowerGrowthOverview;
