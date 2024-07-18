import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function AccountCard({ spaces }) { // Destructure spaces from props
  return (
    <SafeAreaView>
      <ScrollView>
      {
        spaces.map((item, index) => (
          <View key={index} style={{ paddingVertical: hp(4), paddingHorizontal: wp(5), backgroundColor: '#E5E7EB', borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>{item.spaceName}</Text>
            <Text style={{ color: 'black', fontWeight: '600' }}>Members:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'black', fontWeight: '600' }}>Account ID: {item.spaceId}</Text>
              <Text style={{ color: 'black', fontWeight: '600' }}>Join Code: {item.joiningKey}</Text>
            </View>
          </View>
        ))
      }
      </ScrollView>
    </SafeAreaView>
  );
}
