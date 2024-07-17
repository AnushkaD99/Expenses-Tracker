import { View, Text, Pressable } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BalanceCard from '../../components/BalanceCard';
import TransactionsCard from '../../components/TransactionsCard';


export default function Home() {
  
  return (
    <View style={{paddingTop: hp(2), paddingHorizontal: wp(5)}} className="flex-1 gap-5 bg-white">
      <BalanceCard />
      <View className="flex-1 gap-2">
        <View className="flex-row justify-between items-center">
          <Text className="font-bold text-2xl text-black">Transactions</Text>
          <Pressable>
            <Text className="font-semibold text-lg text-neutral-500">View All</Text>
          </Pressable>
        </View>
        <TransactionsCard />
      </View>
    </View>
  )
}