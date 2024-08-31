import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePicker from "@react-native-community/datetimepicker";
import AddPaidByMembersModal from "../../components/AddPaidByMembersModal";
import AddPaidForMembersModal from "../../components/AddPaidForMembersModal";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MemberList from '../../components/MemberList';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';
import { useSpace } from '../../context/spaceContext';
import { updateTotalBalance } from '../../helpers/transactionsHelper';

export default function AddTransaction() {
  const { user } = useAuth();
  const { selectedSpaceId } = useSpace();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(date.toDateString());
  const [value, setValue] = useState(null);
  const [paidByMembers, setPaidByMembers] = useState([]);
  const [paidForMembers, setPaidForMembers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [addPaidByMembersModalVisible, setAddPaidByMembersModalVisible] = useState(false);
  const [addPaidForMembersModalVisible, setAddPaidForMembersModalVisible] = useState(false);

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
      const amount = parseFloat(member.amount) || 0;
      return total + amount;
    }, 0);
  };

  const onSubmit = async () => {
    try {
      if (!description || !value || !paidByMembers.length || !paidForMembers.length) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      const paidForTotalAmount = calculateTotalAmount(paidForMembers);

      if (totalAmount !== paidForTotalAmount) {
        Alert.alert("Error", "Total Amount doesn't match. Please check!");
        return;
      }

      await addDoc(collection(db, "transactions"), {
        date: Timestamp.fromDate(date),
        description,
        category: value,
        paidBy: paidByMembers,
        paidFor: paidForMembers,
        totalAmount,
        spaceId: selectedSpaceId,
        createdBy: user?.userId,
        createdAt: Timestamp.fromDate(new Date()),
        isDeleted: false,
      });

      const balanceUpdateResult = await updateTotalBalance(paidByMembers, paidForMembers, selectedSpaceId);

      if (balanceUpdateResult.success) {
        console.log("Balances updated successfully");
      } else {
        console.log("Failed to update balances:", balanceUpdateResult.msg);
      }

      resetForm();
    } catch (error) {
      Alert.alert("Error", `Failed to add transaction: ${error.message}`);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setShowPicker(false);
    setFormattedDate(new Date().toDateString());
    setValue(null);
    setPaidByMembers([]);
    setPaidForMembers([]);
    setTotalAmount(0);
    setDescription("");
  };

  useEffect(() => {
    if (paidByMembers.length) {
      const total = calculateTotalAmount(paidByMembers);
      setTotalAmount(total);
    }
  }, [paidByMembers]);

  const data = [
    { label: 'Food', value: 'Food' },
    { label: 'Transpotation', value: 'Transpotation' },
    { label: 'Housing', value: 'Housing' },
    { label: 'Health Care', value: 'Health Care' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Other', value: 'Other' },
  ];

  const renderItem = item => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
      {item.value === value && (
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Date:</Text>
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onDateChange}
              />
            )}
            <Pressable onPress={toggleDatePicker} style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="Select date"
                value={formattedDate}
                editable={false}
              />
            </Pressable>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.label}>Category:</Text>
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
              onChange={item => setValue(item.value)}
              renderItem={renderItem}
            />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              onChangeText={setDescription}
              style={styles.input}
              placeholder='Enter Description'
              placeholderTextColor='gray'
              value={description}
            />
          </View>

          <View style={styles.selectorContainer}>
            <Text style={styles.label}>Paid by:</Text>
            <Pressable style={styles.button} onPress={() => setAddPaidByMembersModalVisible(true)}>
              <Text style={styles.buttonText}>Select Member</Text>
            </Pressable>
          </View>
          <MemberList members={paidByMembers} />

          {paidByMembers.length ? <Text style={styles.totalAmount}>Full Amount: {totalAmount}</Text> : null}

          <View style={styles.selectorContainer}>
            <Text style={styles.label}>Paid for:</Text>
            <Pressable style={styles.button} onPress={() => setAddPaidForMembersModalVisible(true)}>
              <Text style={styles.buttonText}>Select Member</Text>
            </Pressable>
          </View>
          <MemberList members={paidForMembers} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <AddPaidByMembersModal modalVisible={addPaidByMembersModalVisible} setModalVisible={setAddPaidByMembersModalVisible} setPaidByMembers={setPaidByMembers} />
      <AddPaidForMembersModal modalVisible={addPaidForMembersModalVisible} setModalVisible={setAddPaidForMembersModalVisible} setPaidForMembers={setPaidForMembers} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  formContainer: {
    flex: 1,
    gap: hp(2),
  },
  datePickerContainer: {
    flexDirection: 'column',
    gap: hp(1),
  },
  descriptionContainer: {
    flexDirection: 'column',
    gap: hp(1),
  },
  categoryContainer: {
    flexDirection: 'column',
    gap: hp(1),
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  dateInputContainer: {
    height: hp(7),
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: wp(4),
  },
  dateInput: {
    fontSize: hp(2),
    fontWeight: '600',
    color: 'black',
  },
  input: {
    fontSize: hp(2),
    fontWeight: '600',
    color: 'black',
    paddingHorizontal: wp(4),
    backgroundColor: 'white',
    borderRadius: 12,
    height: hp(7),
  },
  dropdown: {
    height: hp(7),
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: wp(3),
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
  button: {
    height: hp(5),
    width: wp(35),
    backgroundColor: '#505050',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'gray',
    width: wp(43),
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#272727',
    width: wp(43),
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  totalAmount: {
    fontSize: hp(2.2),
    fontWeight: '600',
    textAlign: 'center',
  },
  label: {
    fontSize: hp(2),
    fontWeight: '600',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
});
