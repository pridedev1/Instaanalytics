"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ADMIN_USER, MEMBERID, PASSWORD, ADMIN_PASS } from "../utils/constants";
import { errorToast } from "../utils/toast";
import LoginPage from "./components/login_page";
import { useRouter } from "next/navigation";
import MyInput from "./components/my-input";
import Cookies from "js-cookie";
import { useAuth } from "@/utils/hooks/useAuth";
import dayjs from "dayjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useWindowDimensions from "@/utils/hooks/useWindownSize";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileLogs, setProfileLogs] = useState<any>([]);
  let [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, logout } = useAuth();

  const getDetails = async () => {
    if (!user && !user!.email) {
      errorToast("User not found");
      return;
    }
    setShowPassword(!showPassword);
    const memberRef = await getDocs(
      query(collection(db, "members"), where("email", "==", user?.email))
    );

    if (!memberRef.empty) {
      const memberDoc = memberRef.docs[0];
      const memberData = memberDoc.data();

      setUserDetails({
        email: memberData.email,
        password: memberData.password,
      });
    }
  };

  const handleLogin = async (
    memberId: string,
    password: string,
    rememberMe: boolean
  ) => {
    // Assuming you have a login function
    // loginUser();
    console.log("ids :", memberId, password, MEMBERID);

    // if (memberId !== MEMBERID) {
    //   errorToast("MemberId Don't match");
    //   return;
    // }
    // if (password !== PASSWORD) {
    //   errorToast("Password was incorrecy");
    //   return;
    // }
    // Check if user is admin
    // Check if user exists in Firebase members collection
    const memberRef = await getDocs(
      query(collection(db, "members"), where("email", "==", memberId))
    );

    if (memberRef.empty) {
      errorToast("Member not found");
      return;
    }

    const memberDoc = memberRef.docs[0];
    const memberData = memberDoc.data();

    // Verify password matches
    if (memberData.password !== password) {
      errorToast("Invalid password");
      return;
    }

    login({ email: memberData.email, id: memberData.id }, memberData.password);
    setIsAuthenticate(true);
    // if (username === "" || username === undefined) return;
    // close();
    // window.open(`/analysis/${username}`, "_blank");
  };

  const getProfileDetail = async () => {
    if (username === "" || username === undefined) return;
    if (typeof window !== "undefined") {
      // Check if username exists in accounts collection
      try {
        setLoading(true);
        const accountRef = doc(db, "accounts", username);
        const accountSnap = await getDoc(accountRef);

        if (accountSnap.exists()) {
          setIsOpen(true);
          const data = accountSnap.data();

          setProfileLogs([{ ...data }]);
        } else {
          window.open(`/analysis/${username}`, "_blank");
          // errorToast("account not ofund");
        }
      } catch (error) {
        errorToast(`${error}`);
      } finally {
        setLoading(false);
      }
      // router.push(`/analysis/${username}`);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = !!Cookies.get("userData");
      if (!isAuth) {
        setIsAuthenticate(false);
      } else {
        setIsAuthenticate(true);
      }
    }
  }, []);
  console.log("cookies :");

  if (!isAuthenticate)
    return (
      <div>
        <LoginPage handleLogin={handleLogin} />
      </div>
    );
  return (
    <main className="w-full flex items-center flex-col gap-8 my-10">
      <AccountLogs
        username={username}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        data={profileLogs}
      />
      <div className="w-full flex justify-end px-8 gap-2">
        <Button
          onClick={() => {
            logout();
            setIsAuthenticate(false);
          }}
          className="rounded-full py-1 px-6 text-sm font-semibold text-white hover:bg-red-600"
        >
          Logout
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full">
              Profile
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Profile Details</h4>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="mt-1 text-sm">{user?.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <div className="mt-1 flex items-center">
                    <input
                      value={showPassword ? userDetails.password : "********"}
                      readOnly
                      className="text-sm bg-transparent"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => getDetails()}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Image
          src={"/insta-login2.png"}
          width={250}
          height={50}
          alt="Instagram analyzer logo"
        />
      </div>
      <div className="my-auto" />
      <div className="w-72 scale-125">
        <div className="border rounded-md p-4 flex flex-col gap-2">
          <div className="mx-2 text-center font-medium">
            Enter your Instagram username to analyze your profile
          </div>
          <MyInput
            onchange={(value: string) => {
              // Parse username from Instagram URL or use direct username
              const username = value.includes("instagram.com/")
                ? value.split("instagram.com/")[1].split("/")[0].split("?")[0]
                : value.startsWith("@")
                ? value.substring(1)
                : value;

              setUsername(username);
            }}
            placeholder="Enter the username"
            value={username}
          />
          <div className="my-2" />
          <Button
            onClick={getProfileDetail}
            className="flex justify-center mx-4 items-center gap-2 rounded-full bg-[#0095F6] py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-[#0095F6]/70 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Analyse Now"}
          </Button>
        </div>
      </div>
      {/* <div className="w-full flex gap-4 mt-6 flex-col items-center justify-center">
        <div className="font-bold text-lg text-black/40">from</div>
        <Image
          src={"/images/meta logo.png"}
          width={120}
          height={50}
          alt="from Meta"
        />
      </div> */}
    </main>
    // <main
    //   className={`bg-[url('/bg_image/cover_page_bg.jpg')] w-screen h-screen bg-no-repeat bg-fixed bg-cover ${
    //     isOpen ? "blur-background" : ""
    //   }`}
    // >
    //   <MyModal
    //     isOpen={isOpen}
    //     open={open}
    //     close={close}
    //     handleLogin={handleLogin}
    //   />
    //   <div className="flex flex-col justify-center items-center h-[80%] relative">
    //     <div className="flex items-center justify-center absolute top-4 left-0 right-0">
    //       <Image
    //         src={"/Logo Black.png"}
    //         width={180}
    //         height={60}
    //         alt="Insta Analytice"
    //         // className="absolute top-4 left-4"
    //       />
    //     </div>
    //     <div className=" flex flex-col gap-4 items-center justify-center pt-20 sm:py-16">
    //       <div className="flex gap-2">
    //         <div className="font-black text-3xl  sm:text-5xl text-black text-center">
    //           ANALYZE YOUR CURRENT INSTAGRAM{" "}
    //           <TypeAnimation
    //             sequence={[
    //               // Same substring at the start will only be typed out once, initially

    //               "COMMENTS",
    //               1000,
    //               "LIKES",
    //               1000,
    //               "FOLLOWERS",
    //               1000,
    //               "REELS",
    //               1000,
    //               "",
    //               1000,
    //             ]}
    //             wrapper="span"
    //             speed={50}
    //             // style={{ fontSize: "2em", display: "inline-block" }}
    //             className="font-black text-3xl sm:text-5xl text-black text-cente"
    //             repeat={Infinity}
    //           />
    //         </div>
    //       </div>
    //       <div className="text-black text-xl text-center">
    //         {" "}
    //         • Dive into the details and discover the insights in your latest
    //         report •{" "}
    //       </div>
    //     </div>
    //     <div className="flex flex-col gap-2 justify-center items-center w-full pt-16">
    //       <div className=" bg-white/50 p-3  rounded-full flex items-center justify-center sm:w-[60%] h-min min-w-[320px] backdrop-blur-lg">
    //         <Image
    //           src={"/instagram-icon.png"}
    //           width={40}
    //           height={40}
    //           alt="input icon"
    //           className="mr-3"
    //         />
    //         <input
    //           placeholder="Enter username"
    //           value={username}
    //           onChange={(e) => {
    //             setUsername(e.target.value);
    //           }}
    //           className="focus:outline-none w-full bg-transparent placeholder-black/60 text-xl font-medium"
    //         />

    //         {loading ? (
    //           <Loader2 className="mr-2 w-10 h-10 animate-spin" />
    //         ) : (
    //           <div className="hidden sm:block">
    //             <AnalysisButton
    //               getProfileDetail={getProfileDetail}
    //               loading={loading}
    //             />
    //           </div>
    //         )}
    //       </div>
    //       <div className="block sm:hidden">
    //         <AnalysisButton
    //           getProfileDetail={getProfileDetail}
    //           loading={loading}
    //           isFullWith={true}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </main>
  );
}

function AccountLogs({
  open,
  onClose,
  data,
  username,
}: {
  open: any;
  username: any;
  onClose: any;
  data: any[];
}) {
  const { width } = useWindowDimensions();
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl ">
        <div>
          <div className="font-bold text-xl mb-2">Account Activity Logs</div>

          <div className="w-full -mx-4 sm:mx-0">
            <div
              className="min-w-full px-4 sm:px-0"
              style={{
                width: width !== undefined && width < 768 ? width : undefined,
              }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Member</TableHead>
                    <TableHead className="whitespace-nowrap">Grade</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Engagement Rate (%)
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">
                      One Linear
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Eng Change (%)
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Last Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          {item.user}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.grade}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.engagementRate == "" ? "-" : item.enagementRate}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.status == "" ? "-" : item.status}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.oneLinear == "" ? "-" : item.oneLinear}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.engChange == "" ? "-" : item.engChange}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {dayjs(item.lastUpdated).format("MMM D, YYYY h:mm A")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <Button
            onClick={() => {
              window.open(`/analysis/${username}`, "_blank");
            }}
          >
            Process
          </Button>
          <Button variant={"outline"} onClick={onClose}>
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
const AnalysisButton = ({
  getProfileDetail,
  loading,
  isFullWith = false,
}: any) => {
  return (
    <Button
      variant="outline"
      onClick={getProfileDetail}
      disabled={loading}
      className={`flex ${
        isFullWith ? "sm:w-[60%] h-14 min-w-[320px]" : ""
      } items-center gap-2 border bg-gradient-to-r from-[#DC1699] font-medium  to-[#FD6D52] hover:text-white text-white px-6 py-2 rounded-full  hover:bg-gradient-to-r hover:from-[#DC1699]/80 hover:to-[#FD6D52]/80`}
    >
      <p className={isFullWith ? `text-xl` : "text-lg"}>Analyse Now</p>
    </Button>
  );
};
