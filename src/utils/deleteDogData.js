

import { getFirestore, doc, deleteDoc} from "firebase/firestore";


const deleteDog = async (dogId, index) => {
    const db = getFirestore();
    const docRef = doc(db, "users", dogId); // Replace 'dogs' with your Firestore collection name
  
    try {
      await deleteDoc(docRef);
      // Remove the dog from the local array after successful deletion
    //   dogInfo.value.splice(index, 1);
      alert("Dog record deleted successfully.");
    } catch (error) {
      console.error("Error deleting dog record:", error);
      alert("Failed to delete dog record.");
    }
  };

  export { deleteDog } 