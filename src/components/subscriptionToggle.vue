<template>
    <div>
      <label class="toggle">
        <input type="checkbox" v-model="isSubscribed" @change="toggleSubscription" />
        <span class="slider"></span>
      </label>
      <p>{{ isSubscribed ? "Subscribed to reminders" : "Not subscribed to reminders" }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { doc, updateDoc } from "firebase/firestore";
  import { db } from "@/firebase";
  
  // Props
  defineProps({
    userId: String,
    initialSubscribed: Boolean,
  });
  
  const isSubscribed = ref(initialSubscribed);
  
  const toggleSubscription = async () => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { subscribed: isSubscribed.value });
      console.log("Subscription status updated:", isSubscribed.value);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };
  </script>
  
  