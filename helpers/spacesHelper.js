import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getSpacesForUser = (userId, setSpaces) => {
  try {
    const userSpacesRef = collection(db, "userSpaces");
    const q = query(userSpacesRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const spacePromises = querySnapshot.docs.map((snapShot) => {
        const spaceDocRef = doc(db, "spaces", snapShot.data().spaceId);
        return getDoc(spaceDocRef);
      });

      Promise.all(spacePromises).then((spaceDocs) => {
        const allSpaces = spaceDocs.map((spaceDoc) => spaceDoc.data());
        setSpaces([...allSpaces]);
      });
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error:", error);
  }
};
