import {
    collection,
    query,
    where,
    onSnapshot,
    increment,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getTransactionsBySpaceId = (spaceId, setTransactions) => {
    try {
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("spaceId", "==", spaceId));

        // Corrected the usage of onSnapshot
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allTransactions = snapshot.docs.map(doc => {
                const data = doc.data();

                // Convert Firestore Timestamps to ISO string
                if (data.date && data.date.seconds) {
                    data.date = new Date(data.date.seconds * 1000).toISOString();
                }
                if (data.createdAt && data.createdAt.seconds) {
                    data.createdAt = new Date(data.createdAt.seconds * 1000).toISOString();
                }

                return data;
            });

            setTransactions(allTransactions);
        });

        return unsubscribe;
    } catch (error) {
        console.log("Error:", error);
    }
};

// Function to update total balance in userSpaces
export const updateTotalBalance = async (paidByMembers, paidForMembers, selectedSpaceId) => {
    try {
      // Update balance for members who paid
      for (const member of paidByMembers) {
        const { userId, amount } = member;
        const userSpaceDocRef = doc(db, "userSpaces", `${userId}_${selectedSpaceId}`);
  
        // Subtract the paid amount from the totalBalance
        await updateDoc(userSpaceDocRef, {
          totalBalance: increment(-parseFloat(amount))
        });
      }
  
      // Update balance for members who were paid for
      for (const member of paidForMembers) {
        const { userId, amount } = member;
        const userSpaceDocRef = doc(db, "userSpaces", `${userId}_${selectedSpaceId}`);
  
        // Add the paidFor amount to the totalBalance
        await updateDoc(userSpaceDocRef, {
          totalBalance: increment(parseFloat(amount))
        });
      }
  
      return { success: true };
    } catch (error) {
      console.log("Error updating total balance:", error);
      return { success: false, msg: error.message };
    }
  };
