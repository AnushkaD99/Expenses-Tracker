import {Alert, Modal, Text, Pressable, View, TextInput, ActivityIndicator} from 'react-native';
import React, { useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRef } from 'react';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export default function PasswordChangeModal({ modalVisible, setModalVisible }) {
    const [loading, setLoading] = useState(false);
    const currentPwdRef = useRef("");
    const newPwdRef = useRef("");
    const confirmPwdRef = useRef("");

    const handlePress = async() => {
        console.log(newPwdRef);
        console.log(confirmPwdRef);

        if(!currentPwdRef || !newPwdRef || !confirmPwdRef) {
            Alert.alert('Change Password', "Please fill all fields!");
            return;
        }

        if(newPwdRef.current != confirmPwdRef.current) {
            Alert.alert('Change Password', "New Password and Confirm Password don't match. Please check.");
            return;
        }

        await changePassword(currentPwdRef.current, newPwdRef.current);
    }

    const changePassword = async (currentPwd, newPwd) => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user) {
            Alert.alert('Change Password', "No user is currently signed in.");
            return;
        }
    
        const credential = EmailAuthProvider.credential(user.email, currentPwd);
    
        try {
            // Re-authenticate the user
            await reauthenticateWithCredential(user, credential);
    
            // Update the password
            await updatePassword(user, newPwd);
            Alert.alert('Change Password', "Password updated successfully!");
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                Alert.alert('Change Password', "The current password is incorrect.");
            } else {
                Alert.alert('Change Password', `Failed to update password: ${error.message}`);
            }
        }
    };

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 justify-center items-center">
            <View className="bg-white rounded-md p-5 items-center shadow-md shadow-gray gap-5">
                <Text className="text-2xl font-bold">Change Password</Text>
                <View className="gap-5">
                    <View style={{height: hp(10)}} className="flex-col gap-1">
                        <Text className="text-left text-lg font-semibold">Current Password :</Text>
                        <TextInput
                            onChangeText={value => currentPwdRef.current=value}
                            style={{fontSize: hp(2), width: wp(80)}}
                            className="flex-1 font-semibold text-neutral-700  px-4 bg-neutral-100 items-center rounded-xl w-full"
                            placeholder='Enter Current Password'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View style={{height: hp(10)}} className="flex-col gap-1">
                        <Text className="text-left text-lg font-semibold">New Password :</Text>
                        <TextInput
                            onChangeText={value => newPwdRef.current=value}
                            style={{fontSize: hp(2), width: wp(80)}}
                            className="flex-1 font-semibold text-neutral-700  px-4 bg-neutral-100 items-center rounded-xl w-full"
                            placeholder='Enter New Password'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View style={{height: hp(10)}} className="flex-col gap-1">
                        <Text className="text-left text-lg font-semibold">Confirm Password :</Text>
                        <TextInput
                            onChangeText={value => confirmPwdRef.current=value}
                            style={{fontSize: hp(2), width: wp(80)}}
                            className="flex-1 font-semibold text-neutral-700  px-4 bg-neutral-100 items-center rounded-xl w-full"
                            placeholder='Enter Confirm Password'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                </View>
                <View className="flex-row gap-5">
                    <Pressable
                    onPress={handlePress}
                    style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                        {
                        loading ? <ActivityIndicator color={'white'} /> :
                        <Text style={{ fontSize: hp(2.2)}} className="text-white font-bold">Change</Text>
                        }
                    </Pressable>

                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{ height: hp(6.5), backgroundColor: 'red', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                        <Text style={{ fontSize: hp(2.2)}} className="text-white font-bold">Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>
  )
}