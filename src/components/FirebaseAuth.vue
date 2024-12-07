<template>
  <div class="">

    <div class="flex flex-col items-center">
    <button class="secondBtn m-2" @click="signInWithGoogle">Sign in with Google</button>
     <button class="primaryBtn m-2" v-if="!emailSignIn" @click="activateEmailSignIn">Sign in with Email</button>
    </div>
     <form
     class="flex flex-col items-center m-5 border-t border-roseL" 
     v-if="emailSignIn" @submit.prevent="signInWithEmail">
     <h4 class=" py-[20px]">Email Sign In</h4>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button class="primaryBtn m-2" type="submit">Sign in with Email</button>
      <button class="linkBtn underline" @click="resetPassword">Reset Password</button>

    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

// Reactive variables for email and password inputs
const email = ref("");
const password = ref("");
const emailSignIn = ref(false);

const activateEmailSignIn = () => {
  emailSignIn.value = true;
}

// Google Sign-In Method
const signInWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    window.location.href = "/account"; // Example redirect
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
    alert(`Google sign-in failed: ${error.message}`);
  }
};


const signInWithEmail = async () => {
  const auth = getAuth();

  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value);

    if (!result.user.emailVerified) {
      alert("Your email is not verified. Please check your inbox for the verification email.");
      return; // Prevent further actions if the email is not verified
    }
    window.location.href = "/account"; 

  } catch (error) {
    if (error.code === "auth/user-not-found") {
      try {
        const signUpResult = await createUserWithEmailAndPassword(auth, email.value, password.value);
        await sendEmailVerification(signUpResult.user);
        alert(`Please check your inbox for the verification email`);

        window.location.href = "/";

      } catch (signUpError) {
        console.error("Error during sign-up:", signUpError.message);
        // alert(`Sign-up failed: ${signUpError.message}`);
      }
    } else {
      console.error("Error during Email/Password sign-in:", error.message);
      // alert(`Email/Password sign-in failed: ${error.message}`);
    }
  }
};

const resetPassword = async () => {
  const auth = getAuth();

  if (!email.value) {
    alert("Please enter your email address to reset your password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value);
    alert(`Password reset email sent to ${email.value}. Please check your inbox.`);
  } catch (error) {
    console.error("Error during password reset:", error.message);
    alert(`Failed to send password reset email: ${error.message}`);
  }
};

</script>
