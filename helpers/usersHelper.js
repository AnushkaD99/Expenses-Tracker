import { collection, doc, getDoc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Fetch users for a specific space
export const getUsersForSpace = (spaceId, setUsers) => {
  try {
    const userSpacesRef = collection(db, "userSpaces");
    const q = query(userSpacesRef, where("spaceId", "==", spaceId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userPromises = querySnapshot.docs.map((snapShot) => {
        const userDocRef = doc(db, "users", snapShot.data().userId);
        return getDoc(userDocRef);
      });

      Promise.all(userPromises).then((userDocs) => {
        const allUsers = userDocs.map((userDoc) => userDoc.data());
        setUsers([...allUsers]);
      });
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error:", error);
  }
};

// Get total balance for a user in a specific space
export const getTotalBalance = async (userId, spaceId) => {
  try {
    const userSpaceDocRef = doc(db, "userSpaces", `${userId}_${spaceId}`);
    const docSnap = await getDoc(userSpaceDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { success: true, totalBalance: data.totalBalance };
    } else {
      return { success: false, msg: "User-space relationship not found." };
    }
  } catch (error) {
    console.log("Error fetching total balance:", error);
    return { success: false, msg: error.message };
  }
};

// Change the username for a specific user
export const changeUsername = async (userId, newUsername) => {
  try {
    if (newUsername.trim() === '') {
      return { success: false, msg: "Username cannot be empty." };
    }

    // Reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Update the username in the user's document
    await updateDoc(userDocRef, {
      username: newUsername
    });

    return { success: true, msg: "Username updated successfully." };
  } catch (error) {
    console.log("Error updating username:", error);
    return { success: false, msg: error.message };
  }
};
