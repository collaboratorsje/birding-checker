import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from './firebase'; // Adjust the path as necessary

// Function to mark a bird as seen
export const markBirdAsSeen = async (userId, birdId) => {
    const userDocRef = doc(db, "users", userId);
  
    // Check if the document exists
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      // Create the document with the first seen bird
      await setDoc(userDocRef, { seenBirds: [birdId] });
    } else {
      // Update the document by adding the new bird ID
      await updateDoc(userDocRef, {
        seenBirds: arrayUnion(birdId)
      });
    }
  };

// Function to unmark a bird as seen
export const unmarkBirdAsSeen = async (userId, birdId) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        seenBirds: arrayRemove(birdId)
    });
};

// Function to get the number of birds seen by the user
export const getNumberOfBirdsSeen = async (userId) => {
  const userDocRef = doc(db, "users", userId);

  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const seenBirdsCount = userData.seenBirds ? userData.seenBirds.length : 0;
      return seenBirdsCount;
    } else {
      return 0; // User document does not exist, so no birds seen
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};