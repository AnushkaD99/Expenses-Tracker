import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getUsersForSpace } from '../helpers/usersHelper';

export default function AccountCard({ spaces }) {
  const [usersBySpace, setUsersBySpace] = useState({});

  useEffect(() => {
    spaces.forEach((space) => {
      getUsersForSpace(space.spaceId, (users) => {
        setUsersBySpace((prevUsers) => ({
          ...prevUsers,
          [space.spaceId]: users,
        }));
      });
    });
  }, [spaces]);

  return (
    <View>
      {spaces.map((item, index) => (
        <View key={index} style={{ paddingVertical: hp(4), paddingHorizontal: wp(5), backgroundColor: '#E5E7EB', borderRadius: 12, marginBottom: 16 }}>
          <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>{item.spaceName}</Text>
          <Text style={{ color: 'black', fontWeight: '600' }}>Members: </Text>
          {usersBySpace[item.spaceId] ? (
            usersBySpace[item.spaceId].map((user, userIndex) => (
              <Text key={userIndex} style={{ color: 'black' }}>- {user.username}</Text>
            ))
          ) : (
            <Text style={{ color: 'black' }}>Loading members...</Text>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', fontWeight: '600' }}>Account ID: {item.spaceId}</Text>
            <Text style={{ color: 'black', fontWeight: '600' }}>Join Code: {item.joiningKey}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
