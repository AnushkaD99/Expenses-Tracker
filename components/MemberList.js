import { View, Text } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function MemberList({members}) {
  return (
    <>
    <View className="w-full mb-3" style={{paddingTop: hp(2), paddingHorizontal: wp(5)}}>
        {members.length ? (
            <>
            <View style={{height: hp(5)}}>
                <View className="flex-row">
                    <View style={{width: wp(43)}} className="items-start flex-1">
                        <Text className="font-semibold text-lg">Name</Text>
                    </View>
                    <View style={{width: wp(43)}} className="items-start flex-1">
                        <Text className="font-semibold text-lg">Amount(Rs.)</Text>
                    </View>
                </View>
                <View className="h-0.5 bg-black w-full "></View>
            </View>
            {members.map((item, index) => (
                <View style={{height: hp(5)}}>
                    <View className="flex-row" key={index}>
                        <View style={{width: wp(43)}} className="items-start flex-1">
                            <Text>- {item.username}</Text>
                        </View>
                        <View style={{width: wp(43)}} className="items-start flex-1">
                            <Text>{item.amount}</Text>
                        </View>
                    </View>
                    <View className="h-0.5 bg-black w-full "></View>
                </ View>
            ))}
            </>
        ) : (
            <Text>No Selected Members.</Text>
        )}
        </View>
    </>
  )
}