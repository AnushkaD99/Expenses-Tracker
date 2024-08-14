import React, { useRef, useState } from 'react'
import {Alert, Modal, Text, Pressable, View, TextInput, ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { addDoc, collection, doc, getDoc, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function JoinSpaceModal({modalVisible, setModalVisible}) {
    const {user} = useAuth();
    const spaceIdRef = useRef("");
    const joiningKeyRef = useRef();
    const [loading, setLoading] = useState(false);

    const JoinSpace = async (spaceId, joiningKey, userId) => {
    try {
        // Check if the space exists
        const spacesRef = doc(db, "spaces", spaceId);
        const spaceDoc = await getDoc(spacesRef);

        if (!spaceDoc.exists()) {
            return { success: false, msg: "Space does not exist" };
        }

        // Verify the joining key
        const spaceData = spaceDoc.data();

        //joining key convert to number
        const key = parseInt(joiningKey, 10);
        console.log(typeof(spaceData.joiningKey));
        console.log(typeof(key));

        if (spaceData.joiningKey !== key) {
            return { success: false, msg: "Invalid joining key" };
        }

        console.log("Space exists and joining key is correct");

        // Store the userId and spaceId in the userSpaces collection
        await setDoc(doc(db, "userSpaces", `${userId}_${spaceId}`), {
            userId,
            spaceId,
            updatedAt: Timestamp.fromDate(new Date()),
            totalBalance: 0,
            isDeleted: false
        });

        return { success: true };

    } catch (error) {
        let msg = error.message;
        return { success: false, msg };   
    }
};

     const hadleJoin = async () => {
        const spaceId = spaceIdRef.current;
        const joiningKey = joiningKeyRef.current;

        if(!spaceId || !joiningKey) {
            Alert.alert('Join Space', "Please fill all fields");
            return;
        }

        setLoading(true);

        let response = await JoinSpace(spaceId, joiningKey, user?.userId);

        setLoading(false);

        if(response.success) {
            Alert.alert('Join Successfully', "You join to space successfully");
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
                <Text className="text-2xl font-bold">Join to Exixting Space</Text>
                <View className="gap-5">
                    <View style={{height: hp(10)}} className="flex-col gap-1">
                        <Text className="text-left text-lg font-semibold">Space Id :</Text>
                        <TextInput
                            onChangeText={value => spaceIdRef.current=value}
                            style={{fontSize: hp(2), width: wp(80)}}
                            className="flex-1 font-semibold text-neutral-700  px-4 bg-neutral-100 items-center rounded-xl w-full"
                            placeholder='Enter Space Id'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View style={{height: hp(10)}} className="flex-col gap-1">
                        <Text className="text-left text-lg font-semibold">Joining Key :</Text>
                        <TextInput
                            onChangeText={value => joiningKeyRef.current=value}
                            style={{fontSize: hp(2), width: wp(80)}}
                            className="flex-1 font-semibold text-neutral-700  px-4 bg-neutral-100 items-center rounded-xl w-full"
                            placeholder='Enter Joining Key'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                </View>
                <View className="flex-row gap-5">
                    <Pressable
                    onPress={hadleJoin}
                    style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                        {
                        loading ? <ActivityIndicator color={'white'} /> :
                        <Text style={{ fontSize: hp(2.2)}} className="text-white font-bold">Join</Text>
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