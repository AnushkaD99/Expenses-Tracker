import { View, Text } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function AccountCard() {
  return (
    <View style={{paddingVertical: hp(4), paddingHorizontal: wp(5)}} className="w-full bg-neutral-200 flex-col justify-center items-center rounded-xl gap-2">
        <Text className="text-black text-3xl font-bold">Name</Text>
        <Text className="text-black font-semibold">Members :</Text>
        <View className="flex-row justify-between">
            <Text className="text-black font-semibold">Account ID :</Text>
            <Text className="text-black font-semibold">Join Code :</Text>
        </View>
    </View>
  )
}