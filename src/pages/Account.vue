<script setup>
import { watch, ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { fetchUserByEmail } from "../utils/fetchUser";
import { deleteDog } from "../utils/deleteDogData";

import { db } from "../firebaseConfig"; // Firestore initialization

import DogFormPopup from "../components/DogFormPopup.vue";

import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import required Firestore functions


const userStore = useUserStore();
const userData = ref(null);
const isPopupVisible = ref(false); // Controls visibility of the popup
const isEditing = ref(false); // Tracks whether we're in editing mode
const selectedDog = ref({}); // Stores the dog data for the form
const removePopupVisible = ref(false);
const currentDataIndex = ref(0);


let unsubscribe = null; // Store the Firestore listener unsubscribe function

// Fetch data manually using fetchUserByEmail
const fetchData = async (email) => {
  if (!email) {
    userData.value = null;
    return;
  }

  try {
    const data = await fetchUserByEmail(email); // Your existing function to fetch data
    userData.value = data; // Update userData reactively
  } catch (error) {
    console.error("Error fetching user data:", error);
    userData.value = null;
  }
};

// Set up real-time updates using Firestore's onSnapshot
const setupRealTimeUpdates = (email) => {
  // Unsubscribe from any previous listener
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (!email) {
    userData.value = null;
    return;
  }

  const q = query(collection(db, "users"), where("email", "==", email));

  // Set up the listener
  unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    userData.value = data; // Update userData reactively
    // console.log("Real-time data updated:", data); // Debugging log
  });
};

// Watch for changes in userStore.email
watch(
  () => userStore.email,
  async (newEmail) => {
    if (newEmail) {
      setupRealTimeUpdates(newEmail); // Start real-time updates
      await fetchData(newEmail); // Fetch the initial data for consistency
    } else {
      userData.value = null;
    }
  }
);

// Fetch data and set up real-time updates on component mount
onMounted(async () => {
  if (userStore.email) {
    setupRealTimeUpdates(userStore.email); // Start real-time updates
    await fetchData(userStore.email); // Fetch the initial data
  }
});

// Cleanup the Firestore listener on component unmount
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const editDog = (dog) => {
  selectedDog.value = { ...dog }; // Populate form with existing data
  isEditing.value = true;
  isPopupVisible.value = true;
};

const removeDog = (dog, index) => {
  selectedDog.value = { ...dog }; // Populate form with existing data
  currentDataIndex.value = index;
  removePopupVisible.value = true;
};

const runDeleteDog = (id, index) => {
  deleteDog(id, index);
  removePopupVisible.value = false;


}

const closePopup = () => {
  isPopupVisible.value = false;
};

const closeRemovePopup = () => {
  removePopupVisible.value = false;
};



</script>


<template>
  <div class="container relative">
  <h5 class="text-rose">Welcome Back</h5>
  <h4 class="py-[10px] px-[18px] mt-1 mb-5 ">{{ userStore.email }}</h4>  
  <div class="flex flex-wrap w-full justify-center" >
    <div class="basis-full sm:basis-1/2 lg:basis-1/3 p-4 text-left" v-if="userData && userData.length > 0" v-for="(user, index) in userData" :key="index">
      <div class="border-2 border-grayD rounded-lg p-8 h-full">
        <h1 class="logo pb-5 rounded-lg">🐶</h1>
        <div class="leading-10">
          <h3 class="rammetto">{{ user.name }}</h3>
          <p>Age: {{ user.age }} months old</p>
          <p>Weight: {{ user.weight }} lb</p>
          <p>Breed: {{ user.breed }}</p>
          <div class="" >
            <h4 class="text-rose mt-5 border-b border-rose">Vaccination Info</h4>
            <div v-if="user.vaccined" v-for="(vaccine, index) in user.vaccines" :key="index" 
            class="vaccine-row border-b border-gray" >
              <p>
                <span v-if="vaccine.date">{{ vaccine.type }} : {{ vaccine.date }}</span>
                <span class="text-[#9ca3af]" v-else>{{ vaccine.type }} : No Info</span>
              </p>
            </div>
            <p class="text-[#9ca3af]" v-else>Needs Vaccination!</p>
          </div>
        </div>
        <button class="primaryBtn mt-5 mr-2" @click="editDog(user)">Edit</button>
        <button class="secondBtn mt-5" @click="removeDog(user, index)">Remove</button>

      </div>
    </div>
    <div v-else>
       Add your furry friend to get started
    </div>
  </div>
  <router-link class="btn primaryBtn mt-5" to="/form">add new</router-link>

  <!-- <button class="primaryBtn mt-5">add new</button> -->

  <DogFormPopup
      :visible="isPopupVisible"
      :dogData="selectedDog"
      :isEditing="isEditing"
      @close="closePopup"
    />

    <div v-if="removePopupVisible" class="absolute p-8 shadow-2xl rounded-lg border border-grayD bg-white z-50">
      <p class="mb-8">Remove <strong>{{ selectedDog.name }}</strong>?</p>
      <button class="mr-2 secondBtn" @click="runDeleteDog(selectedDog.id, currentDataIndex)">Remove</button>
      <button class="primaryBtn" @click="closeRemovePopup">Cancel</button>

    </div>

  </div>
</template>

