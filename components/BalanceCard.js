import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { useSpace } from '../context/spaceContext';
import { db } from '../firebaseConfig';
import { onSnapshot, doc } from 'firebase/firestore';

export default function BalanceCard() {
  const { user } = useAuth();
  const { selectedSpaceId } = useSpace();
  
  const [totalBalance, setTotalBalance] = useState(null);

  useEffect(() => {
    if (user?.userId && selectedSpaceId) {
      // Create a reference to the user's balance in the userSpaces collection
      const userSpaceDocRef = doc(db, "userSpaces", `${user.userId}_${selectedSpaceId}`);

      // Set up a listener for real-time updates
      const unsubscribe = onSnapshot(userSpaceDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setTotalBalance(data.totalBalance); // Update the total balance in state
        } else {
          console.log("No such document!");
        }
      });

      // Clean up the listener when the component unmounts or dependencies change
      return () => unsubscribe();
    }
  }, [user?.userId, selectedSpaceId]);

  return (
    <View style={{ paddingVertical: hp(4), paddingHorizontal: wp(5) }} className="w-full bg-neutral-200 flex-col justify-center items-center rounded-xl gap-2">
      <Text className="text-black text-lg font-semibold">Total Balance</Text>
      <View className="flex-col items-center justify-center">
        <Text
          className="text-3xl font-bold"
          style={{
            color: totalBalance !== null && totalBalance < 0 ? 'red' : 'green',
          }}
        >
          {totalBalance !== null ? `${totalBalance} LKR` : "Loading..."}
        </Text>
      </View>
    </View>
  );
  
}
