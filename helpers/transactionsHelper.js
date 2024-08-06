import {
    collection,
    query,
    where,
    onSnapshot
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
