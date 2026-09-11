import { auth } from "./firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";

async function exchangeTokenWithBackend(user: User, role?: string) {
  try {
    console.log("[Auth Flow] 1. Requesting Firebase ID Token...");
    const idToken = await user.getIdToken(true);
    
    console.log("[Auth Flow] 2. Sending Token to Next.js API Route (/api/auth/sync)...");
    const res = await fetch("/api/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken, role: role || "FARMER" }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Authentication synchronization failed.");
    }
    console.log("[Auth Flow] 3. Sync complete and cookie locked by Next.js.");
    return data;
  } catch (error) {
    console.error("[Auth Flow] Error during sync:", error);
    throw error;
  }
}

export async function loginWithGoogle(role?: string) {
  const provider = new GoogleAuthProvider();
  // Force clear any pending popup states if possible, or use popup natively
  const credential = await signInWithPopup(auth, provider);
  return await exchangeTokenWithBackend(credential.user, role);
}

export async function loginWithEmail(email: string, pass: string, role?: string) {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return await exchangeTokenWithBackend(credential.user, role);
}

export async function signupWithEmail(name: string, email: string, pass: string, role?: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (credential.user) {
    await updateProfile(credential.user, { displayName: name });
  }
  return await exchangeTokenWithBackend(credential.user, role);
}

export async function logoutUser() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (e) {
    console.error("[Auth] Backend logout failed:", e);
  } finally {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("[Auth] Firebase logout failed:", e);
    }
  }
}