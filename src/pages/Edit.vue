<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const route = useRoute();
const router = useRouter();

const dog = reactive({
  id: route.query.id,
  name: route.query.name,
  age: route.query.age,
  weight: route.query.weight,
  breed: route.query.breed,
});

const saveDog = async () => {
  if (!dog.id) return;
  console.log('test');

  const dogRef = doc(db, "dogs", dog.id); 
  try {
    await updateDoc(dogRef, {
      name: dog.name,
      age: parseInt(dog.age),
      weight: parseFloat(dog.weight),
      breed: dog.breed,
    });
    alert("Dog data updated successfully!");
    router.push({ name: "DogList" });
  } catch (error) {
    console.error("Error updating dog data:", error);
    // alert("Failed to update dog data.");
  }
};

const goBack = () => {
  router.push({ name: "account" });
};
</script>


<template>
    <div v-if="dog">
      <h2>Edit Dog Data</h2>
      <form @submit.prevent="saveDog">
        <label>
          Name:
          <input v-model="dog.name" type="text" />
        </label>
        <label>
          Age:
          <input v-model="dog.age" type="number" />
        </label>
        <label>
          Weight:
          <input v-model="dog.weight" type="number" />
        </label>
        <label>
          Breed:
          <input v-model="dog.breed" type="text" />
        </label>
        <button type="submit">Save</button>
        <button type="button" @click="goBack">Cancel</button>
      </form>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </template>
  