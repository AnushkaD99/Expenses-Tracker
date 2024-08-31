import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { useSpace } from '../context/spaceContext';
import { db } from '../firebaseConfig';
import { onSnapshot, doc } from 'firebase/firestore';
import { getSpacesForUser } from '../helpers/spacesHelper';

export default function BalanceCard() {
  const { user } = useAuth();
  const { selectedSpaceId } = useSpace();
  const [totalBalance, setTotalBalance] = useState(null);
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      // Assuming `getSpacesForUser` is a function that fetches spaces for a user
      const unsubscribe = getSpacesForUser(user?.userId, setSpaces);
      return unsubscribe;
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId && selectedSpaceId) {
      const userSpaceDocRef = doc(db, "userSpaces", `${user.userId}_${selectedSpaceId}`);

      const unsubscribe = onSnapshot(userSpaceDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setTotalBalance(data.totalBalance);
        } else {
          console.log("No such document!");
        }
      });

      return () => unsubscribe();
    }
  }, [user?.userId, selectedSpaceId]);

  return (
    <View style={{ paddingVertical: hp(4), paddingHorizontal: wp(5) }} className="w-full bg-neutral-200 flex-col justify-center items-center rounded-xl gap-2">
      {spaces.length ? (
        <>
          <Text style={{ color: '#000', fontSize: wp(4), fontWeight: '600' }}>Total Balance</Text>
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: wp(8),
                fontWeight: 'bold',
                color: totalBalance !== null && totalBalance < 0 ? 'red' : 'green',
              }}
            >
              {totalBalance !== null ? `${totalBalance} LKR` : "Loading..."}
            </Text>
          </View>
        </>
      ) : (
        <View>
          <Text style={{
                fontSize: wp(4),
                fontWeight: 'bold',
                color: 'red',
              }}>Please Add or Create Space to Use the Expense Manager.</Text>
        </View>
      )}
    </View>
  );
}
