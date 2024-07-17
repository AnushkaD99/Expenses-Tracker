import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'

export default function CustomKeyBoardView({children}) {
    const ios = Platform.OS == 'ios';
  return (
    <KeyboardAvoidingView
        behavior={ios ? 'padding' : 'height'}
        style={{flex: 1}}
    >
        <ScrollView style={{flex: 1}} bounces={false} showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}