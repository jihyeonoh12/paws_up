import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import your Firestore instance

async function fetchUserByEmail(email) {
  try {
    // Reference to the users collection
    const usersCollectionRef = collection(db, "users");

    // Create a query to find the document by email
    const q = query(usersCollectionRef, where("email", "==", email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Process the results
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("Fetch User Data:", userData);
      return userData; // Returns an array of user objects
    } else {
      // console.log("No user found with the given email.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error; // Re-throw the error for handling
  }
}

export { fetchUserByEmail }