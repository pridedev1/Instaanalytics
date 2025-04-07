"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useParams } from "next/navigation";
import ProfileAnalytics from "@/app/analysis/[id]/analytics";

const Page = () => {
  const [profileD, setProfileD] = useState();
  const [followingD, setFollowerD] = useState();

  const { id } = useParams();
  const fetchCacheDetail = async () => {
    try {
      const accountRef = doc(db, `accounts/${id}`);
      const accountSnap = await getDoc(accountRef);
      if (accountSnap.exists()) {
        const { cache } = accountSnap.data();
        setProfileD(cache.profileData);
        setFollowerD(cache.followingData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCacheDetail();
  }, []);

  return (
    <div>
      {profileD === undefined && followingD === undefined ? (
        <div>Loading...</div>
      ) : (
        <ProfileAnalytics
          print
          preview
          profileD={profileD}
          followingD={followingD}
        />
      )}
    </div>
  );
};

export default Page;
