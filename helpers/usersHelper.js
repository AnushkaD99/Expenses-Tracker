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
