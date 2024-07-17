import { View, Text } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function BalanceCard() {

    const user = {
        balance: 5000.50
    };

  return (
    <View style={{paddingVertical: hp(4), paddingHorizontal: wp(5)}} className="w-full bg-neutral-200 flex-col justify-center items-center rounded-xl gap-2">
        <Text className="text-black text-lg font-semibold">Total Balance</Text>
        <View className="flex-col items-center justify-center">
            <Text className="text-black text-3xl font-bold">Rs. {user.balance}</Text>
            <Text className="text-black font-semibold">(Expenses)</Text>
        </View>
    </View>
  )
}