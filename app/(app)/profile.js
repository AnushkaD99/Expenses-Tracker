import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import { FontAwesome5 } from '@expo/vector-icons';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import { getAuth } from 'firebase/auth';
import UsernameChangeModal from '../../components/UsernameChangeModal';

export default function profile() {
  const [ passwordChangeModalVisible, setPasswordChangeModalVisible ] = useState(false);
  const [ usernameChangeModalVisible, setUsernameChangeModalVisible ] = useState(false);
  const { user } = useAuth();
  const auth = getAuth();
  const userEmail = auth.currentUser.email;
  return (
    <>
      <View style={{paddingTop: hp(2), paddingHorizontal: wp(5)}} className="flex-1 gap-5">
        <View className="flex-row justify-between items-center">
          <View className="flex-col">
              <Text className="font-semibold text-xl">Username</Text>
              <Text className="text-xl ml-5">{user?.username}</Text>
          </View>
          <Pressable onPress={()=> setUsernameChangeModalVisible(true)}>
            <FontAwesome5 name="edit" size={wp(5)} color={'#000000'} />
          </Pressable>
        </View>

          <View className="flex-col">
              <Text className="font-semibold text-xl">Email</Text>
              <Text className="text-xl ml-5">{userEmail}</Text>
          </View>
          <View>
          <TouchableOpacity style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} className="bg-indigo-500 rounded-xl justify-center items-center" onPress={()=> setPasswordChangeModalVisible(true)}>
              <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Change Password</Text>
          </TouchableOpacity>
          </View>
      </View>
      <PasswordChangeModal modalVisible={passwordChangeModalVisible} setModalVisible={setPasswordChangeModalVisible}/>
      <UsernameChangeModal modalVisible={usernameChangeModalVisible} setModalVisible={setUsernameChangeModalVisible}/>
    </>
  )
}