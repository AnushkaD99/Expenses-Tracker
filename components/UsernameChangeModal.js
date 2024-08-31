import { Alert, Modal, Text, Pressable, View, TextInput, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useAuth } from '../context/authContext';
import { changeUsername } from '../helpers/usersHelper';

export default function UsernameChangeModal({ modalVisible, setModalVisible }) {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const { user, setUser } = useAuth();
    const auth = getAuth();

    const handlePress = async () => {
        if (!username.trim()) {
            Alert.alert('Change Username', 'Please enter a valid username.');
            return;
        }
        
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, { displayName: username });
            let response = await changeUsername(user?.userId, username);
            setUser({ ...user, username: username });
            setLoading(false);

            if(response.success) {
                Alert.alert('Change Username', 'Username updated successfully!');
                setModalVisible(false);
            } else {
                Alert.alert('Change Username', response.msg);
            }
        } catch (error) {
            Alert.alert('Change Username', `Failed to update username: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View className="flex-1 justify-center items-center">
                <View className="bg-white rounded-md p-5 items-center shadow-md shadow-gray gap-5">
                    <Text className="text-2xl font-bold">Change Username</Text>
                    <View className="gap-5">
                        <View style={{ height: hp(10) }} className="flex-col gap-1">
                            <Text className="text-left text-lg font-semibold">New Username:</Text>
                            <TextInput
                                onChangeText={setUsername}
                                style={{ fontSize: hp(2), width: wp(80) }}
                                className="flex-1 font-semibold text-neutral-700 px-4 bg-neutral-100 items-center rounded-xl w-full"
                                placeholder='Enter New Username'
                                placeholderTextColor={'gray'}
                                value={username}
                            />
                        </View>
                    </View>
                    <View className="flex-row gap-5">
                        <Pressable
                            onPress={handlePress}
                            style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                            {loading ? <ActivityIndicator color={'white'} /> : 
                            <Text style={{ fontSize: hp(2.2) }} className="text-white font-bold">Change</Text>}
                        </Pressable>

                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}
                            style={{ height: hp(6.5), backgroundColor: 'red', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                            <Text style={{ fontSize: hp(2.2) }} className="text-white font-bold">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
