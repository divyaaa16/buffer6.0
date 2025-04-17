// Firebase config and initialization
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyC1Gmjw1n7B5wCvbOpz3UOm6oVcnO5-yCc",
  authDomain: "womensafety-817bc.firebaseapp.com",
  projectId: "womensafety-817bc",
  storageBucket: "womensafety-817bc.appspot.com",
  messagingSenderId: "346166340312",
  appId: "1:346166340312:web:51b0902e2b8bc2db7fc5ad",
  measurementId: "G-C9W8CX2MW6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };

