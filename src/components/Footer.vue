<script setup>
import { logOutUser } from "../utils/checkUserStatus";

const handleLogout = async () => {
  await logOutUser();
};
</script>


<template>
  <div class="">
    <button class="secondBtn" @click="handleLogout">
        log out
    </button>

  </div>
</template>