<script setup>
    import { computed } from "vue";
    import FirebaseAuth from '../components/FirebaseAuth.vue'
    import { useUserStore } from "../stores/userStore";
    import { logOutUser } from "../utils/checkUserStatus";

    const userStore = useUserStore();
    const signedIn = computed(() => userStore);

    const handleLogout = async () => {
      await logOutUser();
    };


</script>

<template>
  <div class="container h-lvh">
    <div class="m-5">
      <h1 class="text-rose uppercase font-bold logo">Paws Up 🐾</h1>
      <p class="m-2">Keep your furry friends happy and healthy with Paws Up!</p>
    </div>
    <div v-if="signedIn" class="m-5">
      <router-link to="/account" class="btn primaryBtn">Account</router-link>
    </div>

    <FirebaseAuth v-if="!signedIn" />
    <button v-else class="secondBtn" @click="handleLogout">
        log out
    </button>
  </div>
</template>

