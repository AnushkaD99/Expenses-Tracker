import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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

// Function to get total balance for a user in a specific space
export const getTotalBalance = async (userId, spaceId) => {
  try {
    // Get the document reference for the userSpace
    const userSpaceDocRef = doc(db, "userSpaces", `${userId}_${spaceId}`);
    
    // Fetch the document snapshot
    const docSnap = await getDoc(userSpaceDocRef);

    if (docSnap.exists()) {
      // Get the total balance from the document data
      const data = docSnap.data();
      return { success: true, totalBalance: data.totalBalance };
    } else {
      // Document doesn't exist
      return { success: false, msg: "User-space relationship not found." };
    }
  } catch (error) {
    console.log("Error fetching total balance:", error);
    return { success: false, msg: error.message };
  }
};