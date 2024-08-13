// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";

import { FieldValue, Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIRE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIRE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIRE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIRE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIRE_MEASUREMENTID,
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// const getAnal = () => {
//   if (typeof window !== "undefined") {
//     return getAnalytics(firebaseApp);
//   } else {
//     return null;
//   }
// };

// export const analytics = getAnal();
