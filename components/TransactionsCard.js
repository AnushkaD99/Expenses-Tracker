import { View, Text } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function TransactionsCard() {
    const transactions = [
        {
            description: "Dinner",
            amount: 1000.00,
            date: "2024/07/17"
        },
        {
            description: "Evening Tea",
            amount: 1000.00,
            date: "2024/07/17"
        },
        {
            description: "Breakfast",
            amount: 1000.00,
            date: "2024/07/17"
        }
    ]
  return (
    <View className="flex-1 gap-1">
        {
            transactions.map((item, index) => {
                return (
                    <View style={{paddingVertical: hp(2), paddingHorizontal: wp(5)}} className="flex-row justify-between items-center bg-neutral-200 rounded-lg" key={index}>
                        <View className="flex-col justify-start gap-1">
                            <Text className="font-semibold text-2xl">{item.description}</Text>
                            <Text>{item.date}</Text>
                        </View>
                        <Text className="font-semibold text-2xl">Rs. {item.amount}</Text>
                    </View>
                )
            })
        }
    </View>
  )
}