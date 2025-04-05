"use client";
import ProfileAnalytics from "@/app/analysis/[id]/analytics";
import Analytics from "@/app/analytics/[id]/page";
import { db } from "@/utils/firebase";
import { errorToast, successToast } from "@/utils/toast";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ReportPage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState<any>();
  const [followingData, setFollowerData] = useState<any>();
  const [updatedDetials, setUpdatedDetials] = useState<any>();
  const fetchShareData = async () => {
    try {
      const shareRef = doc(db, `/share/${id}`);
      const accountRef = doc(db, `/accounts/${id}`);

      // Run both Firestore queries in parallel
      const [shareSnap, accountSnap] = await Promise.all([
        getDoc(shareRef),
        getDoc(accountRef),
      ]);

      if (!shareSnap.exists()) {
        setFollowerData({});
        setProfileData({});
        return;
      }

      const shareData = shareSnap.data();

      // Update all states at once to avoid multiple re-renders
      if (accountSnap.exists()) {
        console.log("data :", accountSnap.data());
        setUpdatedDetials(accountSnap.data());
      }

      console.log("Share data:", shareData);
      setProfileData(shareData["profileData"]);
      setFollowerData(shareData["followingData"]);
    } catch (error) {
      errorToast(`${error}`);
      console.error("Error fetching share data:", error);
    }
  };

  useEffect(() => {
    fetchShareData();
  }, []);
  return (
    <div>
      {profileData === undefined && followingData === undefined ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : Object.keys(profileData).length === 0 ||
        Object.keys(followingData).length === 0 ? (
        <div className="w-screen h-screen flex items-center justify-center text-xl">
          No Report Found
        </div>
      ) : (
        <ProfileAnalytics
          preview={true}
          profileD={profileData}
          followingD={followingData}
          updatedD={updatedDetials}
        />
      )}
    </div>
  );
};
export default ReportPage;
