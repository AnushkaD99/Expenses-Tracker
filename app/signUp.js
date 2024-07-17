import { View, Text, TextInput, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import CustomKeyBoardView from '../components/CustomKeyBoardView';
import { useAuth } from '../context/authContext';

export default function SignUp() {
  const router = useRouter();
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const  passwordRef = useRef("");
  const  usernameRef = useRef("");

  const hadleRegister = async () => {
    if(!emailRef.current || !passwordRef.current || !usernameRef.current) {
      Alert.alert('Sign In', "Please fill all the fields!");
      return;
    }

    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current);
    setLoading(false);

    console.log('got result: ', response);
    if(!response.success){
      Alert.alert('Sign Up', response.msg);
    }

  }

  return (
    <CustomKeyBoardView>
      <StatusBar style='dark' />
      <View style={{paddingTop: hp(8), paddingHorizontal: wp(5)}} className="flex-1 gap-12" >
        <View className="gap-10">
          <Text  className="text-3xl font-bold text-center tracking-wider text-neutral-800">Sign Up</Text>
          {/* inputs */}
          <View className="gap-5">
            <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => emailRef.current=value}
                style={{fontSize: hp(2)}}
                className="flex-1 font-semibold text-neutral-700"
                placeholder='Email address'
                placeholderTextColor={'gray'}
              />
            </View>
            
            <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
              <Octicons name="lock" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => passwordRef.current=value}
                style={{fontSize: hp(2)}}
                className="flex-1 font-semibold text-neutral-700"
                placeholder='Password'
                placeholderTextColor={'gray'}
                secureTextEntry
              />
            </View>

            <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
              <Feather name="user" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => usernameRef.current=value}
                style={{fontSize: hp(2)}}
                className="flex-1 font-semibold text-neutral-700"
                placeholder='User name'
                placeholderTextColor={'gray'}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={hadleRegister} style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} className="bg-indigo-500 rounded-xl justify-center items-center">
              {
                loading ? <ActivityIndicator color={'white'} /> :
                <Text style={{ fontSize: hp(2.7)}} className="text-white font-bold ">
                  Sign Up
                </Text>
              }
            </TouchableOpacity>

            {/* Sign up text */}
            <View className="flex-row jusify-center items-center">
              <Text style={{fontSize: hp(2)}} className="font-semibold text-neutral-500">Already have an account? </Text>
              <Pressable onPress={() => router.push('signIn')}>
                <Text style={{fontSize: hp(2)}} className="font-bold text-indigo-500">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  )
}