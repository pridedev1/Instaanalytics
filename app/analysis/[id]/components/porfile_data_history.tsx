import React, { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<number>(30); // Track active filter
  const [filteredData, setFilteredData] = useState<DataEntry[]>(() => {
    // Default 30 days filter
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    return data.filter((entry) => new Date(entry.date) >= cutoffDate);
  });

  const bgColor = (value: number) => {
    if (value > 0) return "text-green-500";
    else if (value === 0) return "";
    else return "text-red-500";
  };

  const filterData = (
    days: number | null = null,
    start: Date | null = null,
    end: Date | null = null
  ) => {
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      setFilteredData(
        data.filter((entry) => new Date(entry.date) >= cutoffDate)
      );
      setStartDate(null);
      setEndDate(null);
      setActiveFilter(days);
    } else if (start && end) {
      setFilteredData(
        data.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= start && entryDate <= end;
        })
      );
      setActiveFilter(0); // Reset active filter when using date picker
    }
  };

  return (
    <div className="w-full p-4 rounded-lg">
      <h2 className="flex justify-center mb-8 mt-8">
        <div className="text-2xl z-[1] p-4 w-max font-bold relative">
          Ups and Downs of Follower Growth
          <Image
            src={"/Patch-1.png"}
            fill
            alt="text gradient"
            className="-z-10 rounded-lg"
          />
        </div>
      </h2>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 w-full">
        {/* Quick filter buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => filterData(7)}
            className={`px-4 py-2 text-white rounded-md text-sm sm:text-base ${
              activeFilter === 7 ? "ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: "#408EF2",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Last Week
          </button>
          <button
            onClick={() => filterData(30)}
            className={`px-4 py-2 text-white rounded-md text-sm sm:text-base ${
              activeFilter === 30 ? "ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: "#408EF2",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => filterData(90)}
            className={`px-4 py-2 text-white rounded-md text-sm sm:text-base ${
              activeFilter === 90 ? "ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: "#408EF2",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Last 3 Months
          </button>
        </div>

        {/* Date picker controls */}
        <div className="flex flex-col sm:flex-row gap-2 ">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="px-3 py-2 border rounded-md w-full text-sm sm:text-base"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            placeholderText="End Date"
            className="px-3 py-2 border rounded-md w-full text-sm sm:text-base"
          />
          <button
            onClick={() => filterData(null, startDate, endDate)}
            disabled={!startDate || !endDate}
            className="px-4 py-2 text-white rounded-md disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base"
            style={{
              backgroundColor: "#408EF2",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.opacity = "0.8")
            }
            onMouseOut={(e) =>
              !e.currentTarget.disabled && (e.currentTarget.style.opacity = "1")
            }
          >
            Apply Date Filter
          </button>
        </div>
      </div>
      <div className="bg-white p-2 rounded-md overflow-auto">
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
            {filteredData.map((entry, index) => (
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
    </div>
  );
};

export default ProfileDataHistory;
