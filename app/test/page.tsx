"use client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useState } from "react";

const TestPage = () => {
  const [data, setData] = useState(null);

  // const getData = async () => {
  //   let docRef = doc(db, "/users/list");

  //   let d = (await getDoc(docRef)).data();
  //   setData(d);
  // };
  return (
    <div>
      {/* <button onClick={getData}>get data</button> */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default TestPage;
