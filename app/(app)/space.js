import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SpaceCard from '../../components/SpaceCard';
import CreateSpaceModal from '../../components/CreateSpaceModal';
import JoinSpaceModal from '../../components/JoinSpaceModal';


export default function Space() {
  const [createSpaceModalodalVisible, setCreateSpaceModalVisible] = useState(false);
  const [joinSpaceModalodalVisible, setJoinSpaceModalVisible] = useState(false);

  const accounts = [
    { name: 'Account-1' },
    { name: 'Account-2' },
    { name: 'Account-3' }
  ];

  return (
    <View  style={{paddingTop: hp(2), paddingHorizontal: wp(5)}} className="flex-1 gap-5">
      <View className="flex-row justify-between">
        <TouchableOpacity
        style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(40) }}
        className="bg-indigo-500 rounded-lg justify-center items-center"
        onPress={() => setJoinSpaceModalVisible(true)}
        >
          <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Join Space</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(40) }}
        className="bg-indigo-500 rounded-lg justify-center items-center"
        onPress={() => setCreateSpaceModalVisible(true)}
        >
          <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Create Space</Text>
        </TouchableOpacity>
      </View>
      <Text className="font-bold text-2xl text-black">Space List</Text>
      {accounts.length ? <SpaceCard /> : <Text className="text-center text-xl pt-5">No Spaces Found</Text>}

      <CreateSpaceModal modalVisible={createSpaceModalodalVisible} setModalVisible={setCreateSpaceModalVisible}/>
      <JoinSpaceModal modalVisible={joinSpaceModalodalVisible} setModalVisible={setJoinSpaceModalVisible}/>
    </View>
  )
}