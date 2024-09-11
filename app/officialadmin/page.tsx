"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/firebase";
import { errorToast } from "@/utils/toast";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TableDemo } from "./table";
import LoginPage from "../components/login_page";
import { ADMIN_PASS, ADMIN_USER } from "@/utils/constants";
import MyInput from "../components/my-input";

export default function Home() {
  const [username, setUsername] = useState("");
  const [grade, setGrade] = useState("");
  const [enagementRate, setEnagementRate] = useState("");
  const [status, setStatus] = useState("");
  const [oneLinear, setOneLinear] = useState("");
  const [enageChange, setEnageChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [data, setData] = useState<any>(undefined);

  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (memberId: string, password: string) => {
    // Assuming you have a login function
    // loginUser();

    if (memberId !== ADMIN_USER) {
      errorToast("MemberId Don't match");
      return;
    }
    if (password !== ADMIN_PASS) {
      errorToast("Password was incorrecy");
      return;
    }
    // Set isAuthenticate to true in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("isAuthenticate", "true");
    }
    setIsAuthenticate(true);
    // if (username === "" || username === undefined) return;
    // close();
    // window.open(`/analysis/${username}`, "_blank");
  };

  const fetchData = async () => {
    try {
      let userCol = collection(db, "/accounts");

      let accounts = await getDocs(userCol);

      let temp = accounts.docs.map((a) => {
        let d = a.data();

        return d;
      });
      console.log(temp);

      setData(temp);
    } catch (error) {
      console.log("error :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveUserInfo = async () => {
    if (username === "" || username === undefined) {
      errorToast("Enter the username first");
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, `/accounts/${username}`);
      await setDoc(
        userRef,
        {
          username,
          grade,
          enagementRate,
          status,
          oneLinear,
          enageChange,
          updateAt: Date.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.log("error :", error);
    }
    setLoading(false);
  };

  if (!isAuthenticate)
    return (
      <div className="relative h-screen z-10 focus:outline-none flex gap-2 justify-center items-center">
        <div className="w-96 border rounded-xl p-6">
          <div className="font-bold text-center">ADMIN AUTHORIZE ONLY</div>
          <MyInput
            label={"Member ID"}
            value={memberId}
            placeholder="Member id"
            onchange={(value: string) => setMemberId(value)}
          />
          <div className="my-4" />
          <MyInput
            label={"Security Pin"}
            value={password}
            type={"password"}
            placeholder="Password"
            onchange={(value: string) => setPassword(value)}
          />
          <div className="mt-8 flex gap-4 justify-center">
            <Button
              onClick={() => handleLogin(memberId, password)}
              className="flex justify-center mx-4 items-center gap-2 rounded-full w-full bg-[#0095F6] py-1.5 px-6 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-[#0095F6]/70 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
            >
              Log in
            </Button>
          </div>
        </div>
        {/* <LoginPage handleLogin={handleLogin} /> */}
      </div>
    );

  return (
    <div className="m-4 flex flex-col gap-4">
      <div className="font-bold">Admin Panel</div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Username (Required*)"
        />

        <Input
          type="text"
          onChange={(e) => setGrade(e.target.value)}
          value={grade}
          placeholder="Grade ( A, B+, C- )"
        />
        <Input
          type="text"
          onChange={(e) => setEnagementRate(e.target.value)}
          value={enagementRate}
          placeholder="enagement Rate (9.4, 5.4 )"
        />
        <Input
          type="text"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          placeholder="status ( good, bad )"
        />
        <Input
          type="text"
          onChange={(e) => setEnageChange(e.target.value)}
          value={enageChange}
          placeholder="Eng Change ( -0.4, 0.78 )"
        />
        <Input
          type="text"
          onChange={(e) => setOneLinear(e.target.value)}
          value={oneLinear}
          placeholder="one linear ( good , bad )"
        />
      </div>
      <Button onClick={() => saveUserInfo()}>
        {loading ? "loading...." : "Save"}{" "}
      </Button>

      <div className="font-bold">Table</div>
      {data === undefined ? (
        <div> fetching Details.....</div>
      ) : (
        <TableDemo data={data} />
      )}
    </div>
  );
}
