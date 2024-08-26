"use client";
import InputFile from "@/components/input_file";
import { Button } from "@/components/ui/button";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useState } from "react";
import { storage } from "../utils/firebase";
import axios from "axios";
import { errorToast, successToast } from "../utils/toast";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [started, setStarted] = useState(false);
  console.log("env :", process.env.NODE_ENV);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress if needed
      },
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setFileUrl(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const handleStartReport = async () => {
    try {
      if (fileUrl === undefined)
        throw "No file attachment found, please upload it again";
      let res = await axios.post(
        process.env.NODE_ENV === "production"
          ? "https://api2.instaanalyser.com//generate-follower-count-report"
          : `${process.env.NEXT_PUBLIC_FOLLOWER_COUNT_API}/generate-follower-count-report`,
        {
          docUrl: fileUrl,
        }
      );

      if (res.status === 200) {
        setStarted(true);
        successToast(
          "Report generation has started and will be sent to the provided email"
        );
      }
    } catch (error) {
      console.log("error starting the porcess: ", error);
      errorToast("Fail to start please try again");
    }
  };
  return (
    <main className="flex items-center justify-center flex-col gap-4 my-10 ">
      <div className="text-lg font-bold">Upload the File</div>

      <div className="flex items-center flex-col  justify-center">
        <InputFile accept=".xlsx" onChange={handleFileUpload} />
        <div className="my-4" />
        <Button
          disabled={!started && fileUrl && !uploading ? false : true}
          onClick={handleStartReport}
        >
          {started
            ? "Report will be aviable in few minutes"
            : uploading
            ? "Uploading..."
            : "Start Report Generation"}
        </Button>
      </div>
    </main>
  );
}
