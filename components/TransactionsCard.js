import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getTransactionsBySpaceId } from '../helpers/transactionsHelper';
import { useAuth } from '../context/authContext';
import { useSpace } from '../context/spaceContext';

export default function TransactionsCard() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();
  const { selectedSpaceId } = useSpace();

  useEffect(() => {
    getTransactionsBySpaceId(selectedSpaceId, setTransactions);
  }, [user?.userId, selectedSpaceId]);

  return (
    <View className="flex-1 gap-1">
      {transactions.length === 0 ? (
        <View style={{ paddingVertical: hp(2), paddingHorizontal: wp(5) }} className="bg-neutral-200 rounded-lg">
          <Text className="text-center text-xl">No transactions available</Text>
        </View>
      ) : (
        transactions.slice(0, 5).map((item, index) => (
          <View
            style={{ paddingVertical: hp(2), paddingHorizontal: wp(5) }}
            className="flex-row justify-between items-center bg-neutral-200 rounded-lg"
            key={index}
          >
            <View className="flex-col justify-start gap-1">
              <Text className="font-semibold text-2xl">{item.category}</Text>
              <Text>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <Text className="font-semibold text-2xl">Rs. {item.totalAmount}</Text>
          </View>
        ))
      )}
    </View>
  );
}
