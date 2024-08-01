import React, { useState, useEffect } from 'react';
import { Alert, Modal, Text, Pressable, View, TextInput, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Checkbox from 'expo-checkbox';
import { getUsersForSpace } from '../helpers/usersHelper';

export default function AddPaidByMembersModal({ modalVisible, setModalVisible, setPaidForMembers }) {
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userAmounts, setUserAmounts] = useState({});
    const [users, setUsers] = useState([]);

    const spaceId = "Bodima_9278"

    useEffect(()=> {
        const unsubscribe = getUsersForSpace(spaceId, setUsers);
        console.log(users);
        return unsubscribe;
    },[spaceId])

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter(id => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleAmountChange = (userId, amount) => {
        setUserAmounts(prevAmounts => ({ ...prevAmounts, [userId]: amount }));
    };

    const handleSubmit = () => {
        const paidMembers = selectedUsers.map(userId => {
            const user = users.find(user => user.userId === userId);
            return {
                userId,
                username: user.username,
                amount: userAmounts[userId]
            };
        });

        // Handle the paidMembers array here
        setPaidForMembers(paidMembers);
        console.log(paidMembers);

        setModalVisible(false);
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add Paid For Members</Text>
                    <View style={{ width: wp(80), marginTop: 20 }}>
                        {users.map(user => (
                            <View key={user.userId} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Checkbox
                                    value={selectedUsers.includes(user.userId)}
                                    onValueChange={() => handleCheckboxChange(user.userId)}
                                />
                                <Text style={{ flex: 1, marginLeft: 10 }}>{user.username}</Text>
                                <TextInput
                                    placeholder="Amount"
                                    value={userAmounts[user.userId] || ''}
                                    onChangeText={text => handleAmountChange(user.userId, text)}
                                    style={{ fontSize: hp(2), backgroundColor: '#f0f0f0', paddingHorizontal: 10, borderRadius: 5, width: wp(30) }}
                                    keyboardType='numeric'
                                    editable={selectedUsers.includes(user.userId)}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Pressable
                            onPress={handleSubmit}
                            style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38), marginRight: 10 }}>
                            {loading ? <ActivityIndicator color={'white'} /> : <Text style={{ fontSize: hp(2.2), color: 'white', fontWeight: 'bold' }}>Create</Text>}
                        </Pressable>

                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}
                            style={{ height: hp(6.5), backgroundColor: 'red', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                            <Text style={{ fontSize: hp(2.2), color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
