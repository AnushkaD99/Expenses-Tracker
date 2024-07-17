import React from 'react'
import { Pressable, View, Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';

export default function HomeHeaderUserIcon() {
  const router = useRouter();
  const {logout} = useAuth();

  const hadleLogout = async () => {
    await logout();
  }

  return (
    <View className="pr-7">
      <Menu>
        <MenuTrigger>
          <FontAwesome6 name="user-circle" size={hp(4)} color="black" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => router.push('profile')} text='Profile' />
            
          <MenuOption onSelect={() => hadleLogout()} >
            <Text style={{color: 'red'}}>Log Out</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  )
}