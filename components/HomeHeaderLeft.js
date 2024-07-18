import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useAuth } from '../context/authContext';
import { getSpacesForUser } from '../helpers/spacesHelper';

export default function HomeHeaderLeft() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null); // Initialize with null

  useEffect(() => {
    const unsubscribe = getSpacesForUser(user?.userId, setSpaces);
    return unsubscribe;
  }, [user?.userId]);

  useEffect(() => {
    // Update selectedAccount when spaces change
    if (spaces.length > 0) {
      setSelectedAccount(spaces[0].spaceName); // Set to the first space name
    }
  }, [spaces]);

  return (
    <View style={{ paddingLeft: wp(5) }}>
      <Menu>
        <MenuTrigger>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: hp(3) }}>
              {selectedAccount ? selectedAccount : `Hello ${user.username}`}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </View>
        </MenuTrigger>
        <MenuOptions>
          {spaces.map((space, index) => (
            <MenuOption key={index} onSelect={() => setSelectedAccount(space.spaceName)}>
              <Text style={{ fontSize: hp(2), fontWeight: 'bold', paddingLeft: wp(2), paddingTop: hp(1) }}>
                {space.spaceName}
              </Text>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
}
