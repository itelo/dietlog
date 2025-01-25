"use client"

import { type ReactNode, useCallback, useEffect } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithCustomToken, User } from "firebase/auth";
import { useAuth } from "@clerk/nextjs";
import { firebaseAuth } from "@/lib/firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, userId } = useAuth();

  const handleSigninInFirebase = useCallback(async (user: User | null) => {
    console.log("handleSigninInFirebase")
    console.log(userId)
    if (userId) {
      if (user) {
        console.log("user already logged in firebase")
        return
      }
      console.log("getting token for user", userId);
      const token = await getToken({
        template: "integration_firebase",
      });
      if (token) {
        await firebaseAuth.setPersistence(browserLocalPersistence)
        console.log("signing in with token", token);
        await signInWithCustomToken(firebaseAuth, token);
      }
    } else {
      
      if (user) {
        await firebaseAuth.signOut();
      }
      // Sign out
    }
  }, [userId]);

  useEffect(() => {
    // Set persistence to local to avoid re-authentication on refresh
    setPersistence(firebaseAuth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
          console.log("onAuthStateChanged")
          void handleSigninInFirebase(user)
          // console.log("waht is user", user);
        });
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, []);

  

  return children;
};
