import React from 'react'
import {Alert, Modal, Text, Pressable, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function JoinSpaceModal({modalVisible, setModalVisible}) {
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
            <View className="bg-white rounded-md p-5 items-center shadow-md shadow-gray">
                <Text>Hello World!</Text>
                <View className="flex-row gap-5">
                    <Pressable
                    style={{ height: hp(6.5), backgroundColor: 'green', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(38) }}>
                        <Text style={{ fontSize: hp(2.2)}} className="text-white font-bold">Create</Text>
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