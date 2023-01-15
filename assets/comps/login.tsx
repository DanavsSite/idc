import React, { useState } from 'react'
import { Alert, StyleSheet, View,Pressable,Text } from 'react-native'
import { supabase } from './supabase'
import { TextInput,Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verified,setVerified] = useState(false);
  const [otp,setOTP] = useState('');

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    await AsyncStorage.setItem('userEmail',email)
  }
  async function verifyOTP(){
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type:'signup',
    });
    if(error){
      Alert.alert(error.message)
      setVerified(!verified)
    }else{
      Alert.alert('Success!')
      signInWithEmail()
    }
  }
  async function signUpWithEmail() {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setVerified(true)
  }
  const [eye,setEye] = useState(true)
  return (
    <>

  {!verified ? (

    <View>
      <View style={[StyleSheet.absoluteFillObject,{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center'}]}>
        <Text style={{fontSize:40,marginBottom:25,marginTop:'20%'}}>Welcome</Text>
        <TextInput 
         label="Email"
         left={<TextInput.Icon icon="email" />}
         onChangeText={text => setEmail(text)}
         style={{width:'90%',marginTop:0}}
         
         />
                <TextInput 
         label="Password"
         secureTextEntry={eye}
         right={<TextInput.Icon icon={eye ? 'eye-off' : 'eye'} onPress={() => {setEye(!eye)}}/>}
         onChangeText={text => setPassword(text)}
         style={{width:'90%',marginBottom:5,marginTop:50}}
         left={<TextInput.Icon icon="lock" />}
         />
      </View>

      <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:'105%'}}>
      <View style={[ {marginRight:30,width:'42%'}]}>
      <Button icon="login" mode="contained" onPress={() => signInWithEmail()}>
    Sign In
  </Button>
      </View>
      <View style={[{width:'42%'}]}>
      <Button icon="account-plus" mode="contained" onPress={() => signUpWithEmail()}>
        Sign Up
  </Button>
      </View>
      </View>
    </View>
) : verified  ? (<View style={[{justifyContent:'center',minHeight:'100%'}]}>
  <Text style={{marginBottom:5,marginLeft:'5%',fontWeight:'bold'}}>Enter your OTP:</Text>
  <TextInput
  label={'OTP'}
  onChangeText={(text) => setOTP(text)}
  left={<TextInput.Icon icon={'key'}  />}
  style={{width:'90%',alignSelf:'center'}}/>
          <Button icon="check-decagram" style={{width:'60%',alignSelf:'center',marginTop:10}} mode="contained" onPress={() => verifyOTP()}>
        Verify
  </Button>
  </View>
): null}

  </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 20,
  },
})