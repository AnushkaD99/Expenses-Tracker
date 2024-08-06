import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DateTimePicker from "@react-native-community/datetimepicker";
import AddPaidByMembersModal from "../../components/AddPaidByMembersModal"
import AddPaidForMembersModal from "../../components/AddPaidForMembersModal"


import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MemberList from '../../components/MemberList';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';
import { useSpace } from '../../context/spaceContext';


export default function addTransaction() {
  const { user } = useAuth();
  const { selectedSpaceId } = useSpace();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(date.toDateString());
  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState([]);
  const [addPaidByMembersModalVisible, setAddPaidByMembersModalVisible] = useState(false);
  const [addPaidForMembersModalVisible, setAddPaidForMembersModalVisible] = useState(false);
  const [paidByMembers, setPaidByMembers] = useState([]);
  const [paidForMembers, setPaidForMembers] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [description, setDescription] = useState("");

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    setFormattedDate(currentDate.toDateString());
  };

  const calculateTotalAmount = (members) => {
    return members.reduce((total, member) => {
      return total + parseFloat(member.amount);
    }, 0);
  };

  const onSubmit = async () => {
    try {
      console.log()
      // Validate the data
      if (!description || !value || !paidByMembers.length || !paidForMembers.length) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      const paidForTotalAmount = calculateTotalAmount(paidForMembers);

      if(totalAmount != paidForTotalAmount) {
        Alert.alert("Error", "Total Amount doesn't match. Please check!");
        return;
      }

      // Handle the data
      const docRef = await addDoc(collection(db, "transactions"),{
        date: date,
        description: description,
        category: value,
        paidBy: paidByMembers,
        paidFor: paidForMembers,
        totalAmount: totalAmount,
        spaceId: selectedSpaceId,
        createdBy: user?.userId,
        createdAt: Timestamp.fromDate(new Date()),
        isDeleted: false
      })
      console.log("Document written with ID: ", docRef.id);
      resetForm();
      return {success: true};

    } catch (error) {
      let msg = error.message;
      return {success: false, msg};
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setShowPicker(false);
    setFormattedDate(new Date().toDateString());
    setValue(null);
    setSelected([]);
    setPaidByMembers([]);
    setPaidForMembers([]);
    setTotalAmount(null);
    setDescription("");
  };
  
  useEffect(() => {
    if (paidByMembers.length) {
      const total = calculateTotalAmount(paidByMembers);
      setTotalAmount(total);
    }
  }, [paidByMembers]);  

  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView style={{paddingVertical: hp(2), paddingHorizontal: wp(5)}}>
        <View className="flex-1 gap-5">
          <View className="flex-col gap-0">
            <Text className="text-left text-lg font-semibold">Date :</Text>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onDateChange}
                />
              )}
              <View style={{height: hp(7)}}>
                <Pressable onPress={toggleDatePicker} className="flex-1 justify-center px-4 bg-white rounded-xl w-full">
                  <TextInput
                    classname="font-semibold text-neutral-700"
                    placeholder="Select date"
                    value={formattedDate}
                    editable={false}
                  />
                </Pressable>
              </View>
          </View>

          <View className="flex-col gap-0">
            <Text className="text-left text-lg font-semibold">Description :</Text>
            <View style={{height: hp(7)}}>
              <TextInput
                  onChangeText={(e) => setDescription(e)}
                  style={{fontSize: hp(2)}}
                  className="flex-1 font-semibold text-neutral-700  px-4 bg-white items-center rounded-xl w-full"
                  placeholder='Enter Description'
                  placeholderTextColor={'gray'}
                  value={description}
              />
            </View>
          </View>

          <View className="flex-col gap-0">
            <Text className="text-left text-lg font-semibold">Category :</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
              searchPlaceholder="Search..."
              value={value}
              onChange={item => {
                setValue(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign color="black" name="Safety" size={20} />
              )}
              renderItem={renderItem}
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-left text-lg font-semibold">Paid by :</Text>
            <Pressable style={{height: hp(5), width: wp(35)}} className="justify-center bg-neutral-500 items-center rounded-xl" onPress={() => setAddPaidByMembersModalVisible(true)}>
              <Text className="text-white font-semibold text-lg">Select Member</Text>
            </Pressable>
          </View>
          <MemberList members={paidByMembers} />

          {paidByMembers.length ? <Text className="text-xl font-semibold text-center">Full Amount : {totalAmount}</Text> : null}


          <View className="flex-row justify-between items-center">
            <Text className="text-left text-lg font-semibold">Paid for :</Text>
            <Pressable style={{height: hp(5), width: wp(35)}} className="justify-center bg-neutral-500 items-center rounded-xl" onPress={() => setAddPaidForMembersModalVisible(true)}>
              <Text className="text-white font-semibold text-lg">Select Member</Text>
            </Pressable>
          </View>
          <MemberList members={paidForMembers} />
        </View>

        <View className="flex-row w-full justify-between mb-2">
          <TouchableOpacity style={{backgroundColor:"gray", width: wp(43), height: hp(7), alignItems: "center", justifyContent: "center", borderRadius: 8}} onPress={resetForm}>
            <Text className="text-white text-xl font-bold">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:"#272727", width: wp(43), height: hp(7), alignItems: "center", justifyContent: "center", borderRadius: 8}} onPress={onSubmit}>
            <Text className="text-white text-xl font-bold">Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AddPaidByMembersModal modalVisible={addPaidByMembersModalVisible} setModalVisible={setAddPaidByMembersModalVisible} setPaidByMembers={setPaidByMembers}/>
      <AddPaidForMembersModal modalVisible={addPaidForMembersModalVisible} setModalVisible={setAddPaidForMembersModalVisible} setPaidForMembers={setPaidForMembers}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: hp(7),
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});