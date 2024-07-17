import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AccountCard from '../../components/AccountCard';


export default function Account() {
  const accounts = [
    { name: 'Account-1' },
    { name: 'Account-2' },
    { name: 'Account-3' }
  ];
  return (
    <View  style={{paddingTop: hp(2), paddingHorizontal: wp(5)}} className="flex-1 gap-5">
      <View className="flex-row justify-between">
        <TouchableOpacity style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(40) }} className="bg-indigo-500 rounded-lg justify-center items-center">
          <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Join to Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(40) }} className="bg-indigo-500 rounded-lg justify-center items-center">
          <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Create New Account</Text>
        </TouchableOpacity>
      </View>
      <Text className="font-bold text-2xl text-black">Account List</Text>
      {accounts.length ? <AccountCard /> : <Text className="text-center text-xl pt-5">No Accounts Found</Text>}
    </View>
  )
}