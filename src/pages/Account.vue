<script setup>

import { watch, ref, onMounted, onUnmounted } from "vue";
import { collection, query, where, onSnapshot } from "firebase/firestore"; 

import { useUserStore } from "../stores/userStore";
import { fetchUserByEmail } from "../utils/fetchUser";
import { deleteDog } from "../utils/deleteDogData";
import { db } from "../firebaseConfig"; 

import DogFormPopup from "../components/DogFormPopup.vue";

const userStore = useUserStore();
const userData = ref(null);
const isPopupVisible = ref(false); 
const selectedDog = ref({});
const removePopupVisible = ref(false);
const currentDataIndex = ref(0);


let unsubscribe = null; // Store the Firestore listener unsubscribe function

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
  <div class="container relative sm:px-8 lg:px-0 my-10">
  <div>
  <!-- <h4 class="text-rose uppercase font-bold logoSM p-4 mb-4">Paws Up 🐾</h4> -->
  <router-link to="/" class="text-rose uppercase font-bold logoSM p-4 mb-4">Paws Up</router-link>

</div>
  <h5 class="text-rose mt-8">Welcome Back</h5>
  <h4 class="py-[10px] px-[18px] mt-1 mb-5 ">{{ userStore.email }}</h4> 
  <div class="flex flex-wrap w-full justify-center" >
    <div class="basis-full sm:basis-1/2 lg:basis-1/3 p-3 text-left" v-if="userData && userData.length > 0" v-for="(user, index) in userData" :key="index">
      <div class="border-2 border-grayD rounded-lg p-6 sm:p-8 h-full">
        <h1 class="logo pb-5 rounded-lg">🐶</h1>
        <div class="leading-10">
          <h2 class="rammetto">{{ user.name }}</h2>
          <p>Birthday: {{ user.birthday }} </p>
          <p>Weight: {{ user.weight }} lb</p>
          <p v-if="user.breed">Breed: {{ user.breed }}</p>

          <div class="" >
            <h4 class="text-rose mt-5 border-b border-rose">Vaccination Info</h4>
            <div  v-for="(vaccine, index) in user.vaccines" :key="index" 
            class="vaccine-row border-b border-gray" >
              <p>
                {{ vaccine.type }} : 
                <span v-if="vaccine.reminder" :class=" vaccine.reminder === 'No Info' ? 'text-[#9ca3af]' : (vaccine.reminder.includes('Expired')) ? 'text-roseL' : '' ">
                {{  vaccine.reminder }}
              </span>
              <span v-else>No Info</span>
              </p>
            </div>
          </div>
        </div>
        <button class="primaryBtn mt-5 mr-2" @click="editDog(user)">Edit</button>
        <button class="secondBtn mt-5" @click="removeDog(user, index)">Remove</button>

      </div>
    </div>
    <div v-else>
      <p class="text-black">
       Add your furry friend to get started
      </p>
    </div>
  </div>
  <router-link class="btn primaryBtn mt-5" to="/form">add new</router-link>

  <DogFormPopup
      :visible="isPopupVisible"
      :dogData="selectedDog"
      @close="closePopup"
    />

    <div v-if="removePopupVisible" class="absolute p-8 shadow-2xl rounded-lg border border-grayD bg-white z-50">
      <p class="mb-8">Remove <strong>{{ selectedDog.name }}</strong>?</p>
      <button class="mr-2 secondBtn" @click="runDeleteDog(selectedDog.id, currentDataIndex)">Remove</button>
      <button class="primaryBtn" @click="closeRemovePopup">Cancel</button>

    </div>

  </div>
</template>

