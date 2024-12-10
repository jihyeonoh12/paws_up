<script setup>
import { reactive, watch } from "vue";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Props
const props = defineProps({
  visible: { type: Boolean, required: true }, // Controls visibility of the popup
  dogData: { type: Object, default: () => ({}) }, // Data for editing
});


// Emits
const emit = defineEmits(["close"]); // Emit close event to parent

// Reactive formData initialized with dogData
const formData = reactive({ ...props.dogData });
const today = new Date().toISOString().split('T')[0];

// Watch for changes in dogData to update formData
watch(
  () => props.dogData,
  (newData) => {
    Object.assign(formData, newData); // Update formData when dogData changes
  },
  { immediate: true }
);

// Save the data to Firebase
const saveUser = async () => {
  try {
          const dogRef = doc(db, "users", formData.id); // Use the dog's document ID
      await updateDoc(dogRef, {
        name: formData.name,
        age: formData.age,
        weight: parseInt(formData.weight),
        breed: formData.breed,
        email: formData.email,
        vaccined: formData.vaccined,
        vaccines: formData.vaccines
      });
      alert("Dog details updated successfully!");
    close(); // Close the popup after saving
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Failed to save data.");
  }
};

// Close the popup
const close = () => {
  emit("close");
};
</script>
<template>
    <div v-if="visible" class="popup-overlay max-w-[400px] w-full m-[30px] absolute p-5 shadow-2xl rounded-lg border border-grayD bg-white z-50 top-0">
      <div class="popup-content">
        <h3 class="my-4 text-rose">Edit</h3>
        <form @submit.prevent="saveUser" class="text-left">
          <label for="name">Name</label>
          <input v-model="formData.name" placeholder="Dog's name" required />
          
          <label for="age">Age</label>
          <input v-model="formData.age" placeholder="Age" type="date" :max="today"  required />
          
          <label for="weight">Weight</label>
          <input v-model="formData.weight" placeholder="Weight" type="number" required />
          
          <label for="breed">Breed</label>
          <input v-model="formData.breed" placeholder="Breed" />
          
          <label for="email">Email</label>
          <input v-model="formData.email" placeholder="Email" type="email" required />


          <div class="flex justify-between items-center mb-5">
          <label for="checkbox"> Is {{ formData.name }} vaccined? </label>
          <input 

            type="checkbox" 
            v-model="formData.vaccined" 
          />
        </div>

          <div v-if="formData.vaccined">
          <div v-for="(vaccine, index) in formData.vaccines" :key="index" class="vaccine-row my-2" >
            <label>
              <input type="checkbox" v-model="vaccine.vaccined"/>
               {{ vaccine.type }} 
            </label>
            <input v-if="vaccine.vaccined" v-model="vaccine.date" type="date" required />
          </div>
          <!-- <button type="button" @click="vaccines.push({ vaccineName: '', date: '' })">Add Vaccine</button> -->
        </div>
  
          <button class="primaryBtn m-2" type="submit">Save Changes</button>
          <button class="secondBtn m-2" type="button" @click="close">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  