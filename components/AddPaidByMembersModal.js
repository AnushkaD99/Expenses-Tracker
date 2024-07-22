import React, { useState } from 'react';
import { Alert, Modal, Text, Pressable, View, TextInput, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Checkbox from 'expo-checkbox';

export default function AddPaidByMembersModal({ modalVisible, setModalVisible }) {
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userAmounts, setUserAmounts] = useState({});

    const users = [
        { name: "Anushka", id: 1 },
        { name: "Kivi", id: 2 },
        { name: "Hichcha", id: 3 },
    ];

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
        const paidMembers = selectedUsers.map(userId => ({
            userId,
            amount: userAmounts[userId]
        }));

        // Handle the paidMembers array here
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
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add Paid By Members</Text>
                    <View style={{ width: wp(80), marginTop: 20 }}>
                        {users.map(user => (
                            <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Checkbox
                                    value={selectedUsers.includes(user.id)}
                                    onValueChange={() => handleCheckboxChange(user.id)}
                                    color={'#272727'}
                                />
                                <Text style={{ flex: 1, marginLeft: 10 }}>{user.name}</Text>
                                <TextInput
                                    placeholder="Amount"
                                    value={userAmounts[user.id] || ''}
                                    onChangeText={text => handleAmountChange(user.id, text)}
                                    style={{ fontSize: hp(2), backgroundColor: '#f0f0f0', paddingHorizontal: 10, borderRadius: 5, width: wp(30) }}
                                    keyboardType='numeric'
                                    editable={selectedUsers.includes(user.id)}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Pressable
                            onPress={handleSubmit}
                            style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38), marginRight: 10 }}>
                            {loading ? <ActivityIndicator color={'white'} /> : <Text style={{ fontSize: hp(2.2), color: 'white', fontWeight: 'bold' }}>Add</Text>}
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
