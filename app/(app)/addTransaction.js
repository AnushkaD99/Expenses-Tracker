import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DateTimePicker from "@react-native-community/datetimepicker";
import AddPaidByMembersModal from "../../components/AddPaidByMembersModal"

import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function addTransaction() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(date.toDateString());
  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState([]);
  const [addPaidByMembersModalVisible, setAddPaidByMembersModalVisible] = useState(false);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    setFormattedDate(currentDate.toDateString());
  };

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
    <View className="flex-1">
      <View style={{paddingTop: hp(2), paddingHorizontal: wp(5)}} className="flex-1 gap-3">

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
                onChangeText={value => spaceNameRef.current=value}
                style={{fontSize: hp(2)}}
                className="flex-1 font-semibold text-neutral-700  px-4 bg-white items-center rounded-xl w-full"
                placeholder='Enter Description'
                placeholderTextColor={'gray'}
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

        <View className="flex-col gap-0">
          <Text className="text-left text-lg font-semibold">Paid by :</Text>
          <Pressable style={{height: hp(7)}} className="justify-center bg-neutral-700 items-center rounded-xl w-full" onPress={() => setAddPaidByMembersModalVisible(true)}>
            <Text className="text-white font-semibold text-lg">Select Member</Text>
          </Pressable>
        </View>

        {/* <View className="flex-col gap-0">
          <Text className="text-left text-lg font-semibold">Paid For :</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select member"
            searchPlaceholder="Search..."
            value={selected}
            onChange={item => {
              setSelected(item);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            selectedStyle={styles.selectedStyle}
          />
        </View> */}

      </View>
      <AddPaidByMembersModal modalVisible={addPaidByMembersModalVisible} setModalVisible={setAddPaidByMembersModalVisible}/>
    </View>
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