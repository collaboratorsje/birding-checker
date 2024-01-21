import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from './firebase'; // Adjust the path as necessary

// Function to mark a bird as seen with additional bird details
export const markBirdAsSeen = async (userId, birdId, commonName, scientificName) => {
  const userDocRef = doc(db, "users", userId);

  // Check if the document exists
  const docSnap = await getDoc(userDocRef);
  if (!docSnap.exists()) {
    // Create the document with the first seen bird as an object
    await setDoc(userDocRef, {
      seenBirds: [{ id: birdId, common_name: commonName, scientific_name: scientificName }]
    });
  } else {
    // Update the document by adding the new bird as an object
    await updateDoc(userDocRef, {
      seenBirds: arrayUnion({ id: birdId, common_name: commonName, scientific_name: scientificName })
    });
  }
};

// Function to unmark a bird as seen
export const unmarkBirdAsSeen = async (userId, birdId) => {
  const userDocRef = doc(db, "users", userId);

  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    const updatedSeenBirds = userData.seenBirds.filter(bird => bird.id !== birdId);
    await updateDoc(userDocRef, {
      seenBirds: updatedSeenBirds
    });
  }
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