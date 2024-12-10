<template>
    <div class="container">
      <h2 class="m-8">Tell us about your furry friends!</h2>
      <form class="text-left max-w-[300px] w-full" @submit.prevent="saveUser">
        <label for="name">Name</label>
        <input v-model="name" required />

        <label for="age">Birthday</label>
        <input type="date" v-model="age" :max="today" required />

        <label for="weight">weight (only number)</label>
        <input v-model="weight" required  pattern="[0-9]+"/>
        <label for="breed">Breed (optional)</label>
        <input v-model="breed"   />
        <label for="email">Email</label>
        <input v-model="email" required type="email" />

        <div class="flex justify-between items-center mb-5">
          <label for="checkbox"> Is {{ name }} vaccined? </label>
          <input 

            type="checkbox" 
            v-model="vaccined" 
          />
        </div>

        <div class="mb-8" v-if="vaccined">
          <div v-for="(vaccine, index) in vaccines" :key="index" class="vaccine-row flex items-center gap-3" >
            
              <input type="checkbox" v-model="vaccine.vaccined"/>
              <label for="checkbox">   {{ vaccine.type }} </label>
            <input class="ml-auto w-[200px]" v-if="vaccine.vaccined" v-model="vaccine.date" type="date" required />
          </div>
          <!-- <button type="button" @click="vaccines.push({ vaccineName: '', date: '' })">Add Vaccine</button> -->
        </div>
        <button class="primaryBtn" type="submit">Continue</button>
      </form>
      
    </div>



  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUserStore } from "../stores/userStore";
const userStore = useUserStore();
const name = ref("");
const age = ref("");
const weight = ref("");
const breed = ref("");
const email = ref(userStore.email || "");
const vaccined = ref(false);
const today = new Date().toISOString().split('T')[0];

const vaccines = ref([
  { type: "Rabies", vaccined: false, date: "" },
  { type: "Distemper", vaccined: false, date: "" },
  { type: "Parvovirus", vaccined: false, date: "" },
  { type: "Hepatitis", vaccined: false, date: "" },
  { type: "Leptospirosis", vaccined: false, date: "" } ]);

const vaccineOptions = [
  "Rabies",
  "Distemper",
  "Parvovirus",
  "Hepatitis",
  "Leptospirosis"
];

// Initialize email when the component is mounted
onMounted(() => {
  email.value = userStore.email || ""; // Set email to the current value or an empty string
});

const saveUser = async () => {
  try {
    const userData = {
      name: name.value,
      age: age.value,
      weight: parseInt(weight.value),
      breed: breed.value,
      email: email.value,
      vaccined: vaccined.value,

      vaccines: vaccines.value
    };

    await addDoc(collection(db, "users"), userData);
    window.location.href = "/account"; // Example redirect

    // alert("User data saved successfully!");

    // Reset the form fields
    name.value = "";
    age.value = "";
    weight.value = "";
    breed.value = "";
    email.value = "";
    vaccined.value = false;
    vaccines.value = [
    { Rabies: false, date: "" },
    { Distemper: false, date: "" },
    { Parvovirus: false, date: "" },
    { Hepatitis: false, date: "" },
    { Leptospirosis: false, date: "" } 
    ];
  } catch (error) {
    console.error("Error saving user data:", error);
    alert("Failed to save data.");
  }
};
</script>