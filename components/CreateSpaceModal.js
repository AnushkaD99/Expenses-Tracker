import { doc, setDoc } from 'firebase/firestore';
import React, { useRef, useState } from 'react'
import {Alert, Modal, Text, Pressable, View, TextInput, ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/authContext';


export default function CreateSpaceModal({modalVisible, setModalVisible}) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const spaceNameRef = useRef("");

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        return randomNumber;
    }

    const createSpace = async (spaceName, spaceId, joiningKey, userId) => {
        try {
            // Create the space document in the "spaces" collection
            await setDoc(doc(db, "spaces", spaceId), {
                spaceName,
                spaceId,
                joiningKey,
                createdBy: userId,
                isDeleted: false
            });

            // Create the user-space relationship in the "UserSpaces" collection
            await setDoc(doc(db, "userSpaces", `${userId}_${spaceId}`), {
                userId,
                spaceId,
                isDeleted: false
            });
            return {success: true};
        } catch (error) {
            let msg = error.message;
            return {success: false, msg};
        }
    }

    const hadleRegister = async () => {
        const spaceName = spaceNameRef.current;

        if(!spaceName) {
            Alert.alert('Create Space', "Please Enter Name for Space!");
            return;
        }

        const spaceId = `${spaceName}_${generateRandomNumber()}`;
        const joiningKey = generateRandomNumber();
        
        setLoading(true);

        let response = await createSpace(spaceNameRef.current, spaceId, joiningKey, user?.userId);

        setLoading(false);

        if(response.success) {
            Alert.alert('Space Created Successfully',
                `Space Id: ${spaceId}\nJoining Key: ${joiningKey}`
            );
            setModalVisible(false);
        } else {
            Alert.alert('Space Creation', response.msg);
        }
    }


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
                <Text className="text-2xl font-bold">Create New Space</Text>
                <View className="gap-5">
                    <View style={{height: hp(10)}} className="flex-col gap-1">
                        <Text className="text-left text-lg font-semibold">Space Name :</Text>
                        <TextInput
                            onChangeText={value => spaceNameRef.current=value}
                            style={{fontSize: hp(2), width: wp(80)}}
                            className="flex-1 font-semibold text-neutral-700  px-4 bg-neutral-100 items-center rounded-xl w-full"
                            placeholder='Enter Space Name'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                </View>
                <View className="flex-row gap-5">
                    <Pressable
                    onPress={hadleRegister}
                    style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                        {
                        loading ? <ActivityIndicator color={'white'} /> :
                        <Text style={{ fontSize: hp(2.2)}} className="text-white font-bold">Create</Text>
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