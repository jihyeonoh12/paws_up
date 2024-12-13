<script setup>
import { reactive, watch } from "vue";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { calculateAge } from "../utils/calculateAge";
import { calculateDueDate } from "../utils/calculateDueDate";

const props = defineProps({
  visible: { type: Boolean, required: true }, 
  dogData: { type: Object, default: () => ({}) }, 
});

// Emits
const emit = defineEmits(["close"]);

// Reactive formData initialized with dogData
const formData = reactive({ ...props.dogData });
const today = new Date().toISOString().split('T')[0];
console.log(today);

watch(
  () => props.dogData,
  (newData) => {
    Object.assign(formData, newData);
  },
  { immediate: true }
);

const saveUser = async () => {
  formData.age = calculateAge(formData.birthday);
  formData.vaccines.forEach(vaccine => {
        vaccine.reminder = calculateDueDate(vaccine.type, vaccine.date , formData.age);
  });
  
  try {
      const dogRef = doc(db, "users", formData.id);
      await updateDoc(dogRef, {
        name: formData.name,
        age: formData.age,
        birthday: formData.birthday,
        weight: parseInt(formData.weight),
        breed: formData.breed,
        email: formData.email,
        isSubscribed: formData.isSubscribed,
        vaccined: formData.vaccined,
        vaccines: formData.vaccines
      });
      // alert("Dog details updated successfully!");
    close(); 
  } catch (error) {
    console.error("Error saving data:", error);
    // alert("Failed to save data.");
  }
};

const close = () => {
  emit("close");
};
</script>
<template>
    <div v-if="visible"   
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="relative max-h-[100vh] sm:max-h-[90vh] max-w-[400px] w-full overflow-y-auto p-5 shadow-2xl rounded-lg bg-white">
        <h3 class="my-4 text-rose">Edit</h3>
        <form @submit.prevent="saveUser" class="text-left">
          <label for="name">Name</label>
          <input v-model="formData.name" placeholder="Dog's name" required />
          
          <label for="birthday">Birthday</label>
          <input v-model="formData.birthday" placeholder="birthday" type="date" :max="today"  required />
          
          <label for="weight">Weight (lb)</label>
          <input v-model="formData.weight" placeholder="Weight" type="number" required />
          
          <label for="breed">Breed (optional)</label>
          <input v-model="formData.breed" placeholder="Breed" />
          
          <label for="email">Email</label>
          <input v-model="formData.email" placeholder="Email" type="email" required />

          <div class="flex justify-between items-center mb-5">
            <label for="checkbox">Subscribe to email reminders</label>
            <input 
              type="checkbox" 
              v-model="formData.isSubscribed" 
            />
          </div>

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
            <input v-if="vaccine.vaccined" v-model="vaccine.date" type="date" required :min="formData.birthday" :max="today"/>
          </div>
          <!-- <button type="button" @click="vaccines.push({ vaccineName: '', date: '' })">Add Vaccine</button> -->
        </div>
  
          <button class="primaryBtn m-2" type="submit">Save Changes</button>
          <button class="secondBtn m-2" type="button" @click="close">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  