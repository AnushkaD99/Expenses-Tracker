import { View, Text } from 'react-native'
import React, {useState} from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { useAuth } from '../context/authContext';


export default function HomeHeaderLeft() {

  const {user} = useAuth();

  const accounts = [
    { name: 'Account-1' },
    { name: 'Account-2' },
    { name: 'Account-3' }
  ];

  const [selectedAccount, setSelectedAccount] = useState(accounts.length ? accounts[0].name : null);

  return (
    <View style={{paddingLeft: wp(5)}}>
        <Menu>
        <MenuTrigger>
            <View className="flex-row">
                <Text className="font-bold text-2xl">{selectedAccount ? selectedAccount : `Welcome ${user.username}`}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </View>
        </MenuTrigger>
        <MenuOptions>
            {accounts.map((account, index) => (
                <MenuOption key={index} onSelect={() => setSelectedAccount(account.name)}>
                    <Text className="text-xl font-semibold pt-1 pl-2">{account.name}</Text>
                </MenuOption>
            ))}
        </MenuOptions>
      </Menu>
    </View>
  )
}