import React from "react";
import Image from "next/image";

interface DataEntry {
  follower: number;
  following: number;
  post: number;
  date: string;
  newFollower: number;
  newFollowing: number;
  newPost: number;
}

const ProfileDataHistory: React.FC<{ data: DataEntry[] }> = ({ data }) => {
  const bgColor = (value: number) => {
    if (value > 0) return "text-green-500";
    else if (value === 0) return "";
    else return "text-red-500";
  };
  return (
    <div className="w-full p-4 rounded-lg ">
      <h2 className="flex justify-center mb-8 mt-8 ">
        <div className="text-2xl z-[1] p-4 w-max font-bold relative">
          • Ups and Downs of Follower Growth •
          <Image
            src={"/Patch-1.png"}
            fill
            alt="text gradient"
            className="-z-10 rounded-lg "
          />
        </div>
      </h2>
      <div className="bg-white p-2 rounded-md">
        <table className="min-w-full border p-4 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Followers</th>
              <th className="py-2 px-4 border-b">New followers</th>
              <th className="py-2 px-4 border-b">Following</th>
              <th className="py-2 px-4 border-b">New following</th>
              <th className="py-2 px-4 border-b">Posts</th>
              <th className="py-2 px-4 border-b">New posts</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {(entry.follower / 1000).toFixed(3)}
                </td>
                <td
                  className={`${bgColor(
                    entry.newFollower
                  )}  py-2 px-4 border-b`}
                >
                  {" "}
                  {entry.newFollower > 0 && "+"}
                  {entry.newFollower}
                </td>
                <td className="py-2 px-4 border-b">{entry.following}</td>
                <td className="py-2 px-4 border-b">{entry.newFollowing}</td>
                <td className="py-2 px-4 border-b">{entry.post}</td>
                <td className="py-2 px-4 border-b">{entry.newPost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <h2 className="text-xl font-semibold mb-4">Profile data history</h2> */}
    </div>
  );
};

export default ProfileDataHistory;
