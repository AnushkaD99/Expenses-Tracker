import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import HomeHeaderUserIcon from '../../components/HomeHeaderUserIcon';
import HomeHeaderLeft from '../../components/HomeHeaderLeft';

export default function _layout() {

  const {user} = useAuth();
  return (
    <Tabs screenOptions={{
      tabBarInactiveTintColor: 'gray',
      tabBarActiveTintColor: '#272727',
    }}>
      <Tabs.Screen
        name='home'
        options={{
          tabBarIcon: ({ color, size }) => (<FontAwesome5 name="home" size={size} color={color} />),
          title: 'Home',
          headerTitle: '',
          tabBarLabelStyle: {
            fontSize: hp(1.6),
            fontWeight: 'bold'
          },
          headerRight: () => (
            <HomeHeaderUserIcon />
          ),
          headerLeft: () => (
            <HomeHeaderLeft />
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color, size }) => (<FontAwesome5 name="user-alt" size={size} color={color} />),
          title: 'Account',
          tabBarLabelStyle: {
            fontSize: hp(1.6),
            fontWeight: 'bold'
          },
        }}
      />
    </Tabs>
  )
}