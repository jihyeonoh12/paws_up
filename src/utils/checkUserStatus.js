import { auth, onAuthStateChanged, signOut  } from "../firebaseConfig";
import { useUserStore } from '../stores/userStore';


export function initializeAuthListener() {
  const userStore = useUserStore();

  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      userStore.setUser({
        email: user.email,
      });
    } else {
      userStore.clearUser();
    }
  });
}

export async function logOutUser() {
  try {
    await signOut(auth);

    const userStore = useUserStore(); 
    userStore.clearUser();

    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

