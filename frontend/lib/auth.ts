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

async function exchangeTokenWithBackend(user: User, role?: string, retry = false) {
  try {
    // Always force refresh to avoid stale/expired tokens
    const idToken = await user.getIdToken(true);
    
    const res = await fetch("/api/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken, role: role || "FARMER" }),
    });

    const data = await res.json();
    if (!res.ok) {
      // If token was rejected and we haven't retried yet, force a new token and retry once
      if (!retry && (data.detail?.includes("Invalid Firebase Token") || res.status === 401)) {
        await user.reload(); // Reload user state from Firebase
        return exchangeTokenWithBackend(user, role, true); // retry once
      }
      throw new Error(data.detail || "Authentication synchronization failed.");
    }
    return data;
  } catch (error) {
    console.error("[Auth] Sync error:", error);
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