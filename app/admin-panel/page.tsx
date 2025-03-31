"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/firebase";
import { errorToast, successToast } from "@/utils/toast";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TableDemo } from "./table";
import LoginPage from "../components/login_page";
import { ADMIN_PASS, ADMIN_USER } from "@/utils/constants";
import dayjs from "dayjs";
import MyInput from "../components/my-input";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/utils/hooks/useAuth";

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

  const { user, login } = useAuth();
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (memberId: string, password: string) => {
    // Assuming you have a login function
    // loginUser();

    try {
      // First check if user exists in members collection
      const usersCol = collection(db, "members");
      const userQuery = query(usersCol, where("email", "==", memberId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        // User exists in members collection, check password
        const userData = userSnapshot.docs[0].data();
        if (userData.password === password) {
          login({ email: userData.email, id: userData.id }, password);
          setIsAuthenticate(true);
          return true;
        } else {
          errorToast("Incorrect password");
          return;
        }
      }

      // If user not found in members, check admin credentials
      if (memberId !== ADMIN_USER) {
        errorToast("Invalid member ID");
        return;
      }
      if (password !== ADMIN_PASS) {
        errorToast("Incorrect password");
        return;
      }
      login({ email: ADMIN_USER, id: ADMIN_PASS }, password);
      setIsAuthenticate(true);
    } catch (error) {
      console.error("Login error:", error);
      errorToast("Login failed. Please try again.");
      return;
    }

    // if (username === "" || username === undefined) return;
    // close();
    // window.open(`/analysis/${username}`, "_blank");
  };
  console.log("isAuthenticate :", isAuthenticate);

  const fetchData = async () => {
    try {
      let userCol = collection(db, "/accounts");

      let accounts = await getDocs(userCol);

      let temp = accounts.docs.map((a) => {
        let d = a.data();

        return d;
      });
      console.log("data ", temp);

      setData(temp);
    } catch (error) {
      console.log("error :", error);
    }
  };
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
          user: user?.email,
          updateAt: Date.now(),
        },
        { merge: true }
      );
      successToast("Data saved successfully");
      const newData = data.map((item: any) =>
        item.username === username
          ? {
              username,
              grade,
              enagementRate,
              status,
              oneLinear,
              enageChange,
              user: user?.email,
              updateAt: Date.now(),
            }
          : item
      );

      const usernameExists = data.some(
        (item: any) => item.username === username
      );

      if (!usernameExists) {
        newData.push({
          username,
          grade,
          enagementRate,
          status,
          oneLinear,
          enageChange,
          user: user?.email,
          updateAt: Date.now(),
        });
      }

      setData(newData);
    } catch (error) {
      console.log("error :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    setIsAuthenticate(true);
  }, [user]);
  useEffect(() => {
    fetchData();
  }, []);

  if (!isAuthenticate)
    return (
      <div className="relative h-screen z-10 focus:outline-none flex gap-2 justify-center items-center">
        <div className="w-96 border rounded-xl p-6">
          <div className="font-bold text-center">AUTHORIZED ADMIN ONLY</div>
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
      <div className="font-bold text-xl">Admin Panel</div>
      {user && user.isAdmin && <AddAccount />}
      <div className="border rounded-md p-4">
        <div className="font-bold text-xl mb-4"> Update the Stats</div>
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
        <Button onClick={() => saveUserInfo()} className="mt-4">
          {loading ? "loading...." : "Save"}{" "}
        </Button>
      </div>

      <div className="font-bold">Table</div>
      {data === undefined ? (
        <div> fetching Details.....</div>
      ) : (
        <TableDemo data={data} />
      )}
    </div>
  );
}

const AddAccount = () => {
  const [accounts, setAccounts] = useState<any>(undefined);
  const [addUserDetails, setAddUserDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUsers();
  }, []);
  // get users lis
  const getUsers = async () => {
    try {
      const usersCol = collection(db, "members");
      const q = query(usersCol, orderBy("createdAt", "desc"));
      const usersSnapshot = await getDocs(q);

      const usersList = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          password: data.password,
          createdAt: data.createdAt,
        };
      });

      setAccounts(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      errorToast(`Failed to fetch users: ${error}`);
    }
  };
  const handleAddAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = addUserDetails.email;
    const password = addUserDetails.password;

    if (!email || !password) {
      errorToast("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const usersCol = collection(db, "members");

      // Check if email already exists
      const emailQuery = query(usersCol, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        // Update existing user's password
        const userDoc = emailSnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          password: password,
          updatedAt: new Date().toISOString(),
        });

        // Update local state
        setAccounts(
          accounts.map((account: any) =>
            account.id === userDoc.id
              ? { ...account, password: password }
              : account
          )
        );

        successToast("Password updated successfully");
        form.reset();
        return;
      }

      // Generate unique ID for the new user
      const generateUniqueId = () => {
        return (
          Math.random().toString(36).substring(2) + Date.now().toString(36)
        );
      };
      const uniqueId = generateUniqueId();

      // Add new user with ID included in both document and data
      const newUser = {
        id: uniqueId,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      // Create document with custom ID
      const docRef = doc(db, "members", uniqueId);
      await setDoc(docRef, newUser);

      successToast("Account added successfully");

      // Update local state
      setAccounts([
        {
          ...newUser,
          id: uniqueId, // Ensure ID is consistent
        },
        ...accounts,
      ]);
    } catch (error) {
      console.error("Error managing account:", error);
      errorToast(`Failed to manage account: ${error}`);
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const userRef = doc(db, "members", id);
      await deleteDoc(userRef);
      successToast("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      errorToast(`Failed to delete account: ${error}`);
      return;
    }
    setAccounts(accounts.filter((account: any) => account.id !== id));
  };
  return (
    <div>
      <div className="mb-6 border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Add Account</h2>
        <form
          className="flex gap-4 items-end"
          onSubmit={(e) => handleAddAccount(e)}
        >
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={addUserDetails.email}
              onChange={(e) =>
                setAddUserDetails({
                  ...addUserDetails,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter email address"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={addUserDetails.password}
              onChange={(e) =>
                setAddUserDetails({
                  ...addUserDetails,
                  password: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter password"
            />
          </div>

          <Button type="submit" className="px-6">
            {loading ? <Loader2 className="animate-spin" /> : "Add Account"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts === undefined ? (
                  <TableRow>
                    <TableCell>
                      <Loader2 className="animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : accounts.length === 0 ? (
                  <TableRow>
                    <TableCell>No accounts found</TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account: any) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <span
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            navigator.clipboard.writeText(account.email);
                            successToast("Email copied to clipboard");
                          }}
                        >
                          {account.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-mono cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            navigator.clipboard.writeText(account.password);
                            successToast("Password copied to clipboard");
                          }}
                        >
                          ••••••••
                        </span>
                      </TableCell>
                      <TableCell>
                        {dayjs(account.createdAt).format("MM D, YYYY h:mm A")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setAddUserDetails({
                                email: account.email,
                                password: "",
                              });
                            }}
                            variant="outline"
                            size="sm"
                            className="px-2"
                          >
                            <Pencil size={16} />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteAccount(account.id)}
                            variant="destructive"
                            size="sm"
                            className="px-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
