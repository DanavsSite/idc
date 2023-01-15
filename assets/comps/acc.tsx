import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { StyleSheet, View, Alert,Text, FlatList,ScrollView, TouchableHighlight } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Button,DataTable, TextInput,TouchableRipple } from 'react-native-paper'
import { FlashList } from "@shopify/flash-list";
import DeviceNumber from 'react-native-device-number';
import Lottie from 'lottie-react-native'
import { useQuery } from 'react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer'
export default function Account({ session }: { session: Session }) {
  const [username, setUsername] = useState('')
  const [loc, setloc] = useState('')
  const [sellsc,setsellsc] = useState(false)
  const [buysc,setbuysc] = useState(false)
  const [buylocsc,setbuylocsc] = useState(false)
  const [reqs,setreqs] = useState(null)
  const [sellers,setsellers] = useState(null)
  const [loader ,setLoader ] = useState(false)
  const [num,setnum] = useState('')
  const [numscreen,setnumsc] = useState(true)

  const fetchhdata = async () => {
    email = await AsyncStorage.getItem('userEmail')
    const { data, error } = await supabase
    .from('requests')
    .select()
    .eq('username', `${username}`)
    setLoader(true)
    if(data) {
      console.log(data)
      setLoader(false)
      setreqs(data)
    }else if(error){
      console.log(error)
    }else{
      console.log('something went wrong!')
    }
  }
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      supabase.from('requests').select()
      .eq('usermail',await AsyncStorage.getItem('userEmail')).then(
        (res) => res,
        )
  })

  if (isLoading) {console.log('loading')}

  if (error) {console.log(error)}
  if (data) {
    data.data.map(function(currentValue, index, arr){
      console.log(currentValue.usermail)
    })
  }
  
  async function getsellers(){
    const { data, error } = await supabase
    .from('requests')
    .select()
    .eq('type', `sell`)
    .neq('username',username)
    if(data) {
      console.log('sellers:')
      console.log(data)
      setsellers(data)
    }else if(error){
      console.log(error)
    }else{
      console.log('something went wrong!')
    }
  }
  async function getMail() {
    const name = await AsyncStorage.getItem('userEmail');
    const email = name.slice(0, name.indexOf('@'));
    setUsername(email.toString())
    console.log()
  }


  function removeTime(str:string){
    return str.slice(0,10)
  }
  useEffect(() => {
    async function myfunc() {

      const gotname =await AsyncStorage.getItem('userEmail')
      await getMail()
    }
    getsellers()
    myfunc()
  },[])
  async function sell(){
  setnum(`91+${num}`)
    await supabase
  .from('requests')
  .insert({ username: username,usermail:await AsyncStorage.getItem('userEmail'),type:'sell',location:loc,number:num })
  .then(() => {setsellsc(false); asyncf()} )

}

async function buy(otherID){
  setnum(`91+${num}`)
  const { data, error } = await supabase
    .from('requests')
    .select()
    .eq('id', `${otherID}`)
    if(data) {
      console.log(data)
      if(data[0].username == username){
        Alert.alert("Error: You can't buy from yourself")
        return null;
      }else{
        await supabase
        .from('requests')
        .insert({ username: username,usermail:await AsyncStorage.getItem('userEmail'),type:'buy',towhom:otherID,number:num })
        .then(() => {setbuysc(false); asyncf()} )
      }
    }
}
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  return (
    <View>
      {!sellsc && !buysc && !buylocsc ? 
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={{alignSelf:'center',marginTop:20,fontSize:32,fontWeight:'bold'}}>Welcome,
         <Text style={{color:'#bbaadd'}}>
          {username}</Text>
          </Text>
          <View style={{marginTop:35,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Button onPress={() => setsellsc(true)} icon={'barley'} mode='contained' style={{width:'45%',marginRight:10,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:18}}>Sell</Text></Button>
            <Button onPress={() => setbuysc(true)} icon={'barley'} mode='contained' style={{width:'45%',justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:18}}>Buy</Text></Button>
          </View>

    <Text style={{marginTop:20,fontSize:16,marginLeft:15,marginBottom:10}}>Requests:</Text>
    <ScrollView scrollEnabled style={{height:'60.5%'}} >
      {data ? (
         <DataTable>
      <DataTable.Header style={{borderBottomColor:'rgba(0,0,0,0.3)',borderBottomWidth:1}}>
        <DataTable.Title>Username</DataTable.Title>
        <DataTable.Title numeric>Requested On</DataTable.Title>
        <DataTable.Title numeric>Location</DataTable.Title>
        
        <DataTable.Title numeric>Type
        </DataTable.Title>
      </DataTable.Header>
        <View
        style={{height:'60.5%'}}>

        <FlashList
        data={data.data}
      renderItem={({ item }) => (
        <View>
                <DataTable.Row style={{borderBottomColor:'rgba(0,0,0,0.3)',borderBottomWidth:1,width:'100%'}}>
        <DataTable.Cell>{item.username}</DataTable.Cell>
        <DataTable.Cell numeric>{removeTime(item.created_at)}</DataTable.Cell>
        <DataTable.Cell numeric>{item.location}</DataTable.Cell>
        <DataTable.Cell numeric >{capitalizeFirstLetter(item.type)}</DataTable.Cell>
      </DataTable.Row>
        </View>
      )}
      estimatedItemSize={50}
      />
        </View>
    </DataTable>
      ): null}
    </ScrollView>
    {isLoading ?(
      <Lottie autoPlay loop source={require('../loading.json')} />
    )
      :null
    }
        <Button icon="account-minus" mode="contained" style={{width:120,marginTop:20,alignSelf:'center'}} onPress={() => supabase.auth.signOut()}>
    Sign Out
  </Button>
      </View>
      :null}
      {sellsc ? (
        <View style={{height:'100%',justifyContent:'center',alignItems:'center'}}>
          <TextInput onChangeText={locc => setloc(locc)} style={{width:'90%',alignSelf:'center',marginBottom:10}} label={'Location'} left={<TextInput.Icon icon='map-marker' />} />
          <TextInput onChangeText={num => setnum(num)} style={{width:'90%',alignSelf:'center',marginBottom:18,marginTop:20}} label={'Whatsapp Number'} left={<TextInput.Icon icon='sim' />} />
          <View style={{flexDirection:'row',alignItems:'center'}}>

          <Button style={{width:'45%',marginRight:10}} mode='contained' onPress={() => setsellsc(false)}>Cancel</Button>
          <Button style={{width:'45%'}} mode='contained' onPress={async () => await sell()}>Sell</Button>
          </View>
        </View>
      ) : null}
      {buysc  ? (
        <View style={{height:'100%'}}>
          {numscreen ? (

            <View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',zIndex:199,alignItems:'center'}]}>
              <TextInput onChangeText={(val)=>setnum(`91+${val}`)} style={{width:'90%',alignSelf:'center'}} label={'Whatsapp Number'} left={<TextInput.Icon icon='sim' />}/>
              <View style={{marginTop:12.5,flexDirection:'row',alignContent:'center',alignItems:'center',marginHorizontal:'auto'}}>
              <Button mode='contained' style={{width:'45%',alignSelf:'center',backgroundColor:'#aa0000',marginRight:10}} onPress={()=>setnumsc(false)}>Cancel</Button>
              <Button mode='contained' style={{width:'45%',alignSelf:'center'}} onPress={async ()=>{await AsyncStorage.setItem('PN',num).then(()=>setbuysc(false))}}>Submit</Button>
              </View>
          </View>
            ): null}
            <Text style={{fontSize:15,marginTop:30,marginLeft:15}}>Sellers:</Text>
            <ScrollView style={{height:'85%'}}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title >Location</DataTable.Title>
                <DataTable.Title numeric>Requested On</DataTable.Title>
              </DataTable.Header>
              {sellers.map(seller => (
                <TouchableRipple onPress={async () => { buy(seller.id)}}>
              <View>
              <DataTable.Row>
                <DataTable.Cell>{seller.username}</DataTable.Cell>
                <DataTable.Cell >{seller.location}</DataTable.Cell>
                <DataTable.Cell numeric>{removeTime(seller.created_at)}</DataTable.Cell>
              </DataTable.Row>
              </View>
                </TouchableRipple>
            ))}
            </DataTable>
          </ScrollView>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
          <Button mode='contained' style={{width:'45%',margin:10}} onPress={() => setbuysc(false)}>Cancel</Button>
          </View>
        </View>
      )
      :null
    }
    {loader ? (
      <View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center'}]}>
        <Lottie
      autoPlay
      loop
      source={require('../loading.json')}
    />
      </View>

    ) : null

    }
    </View>
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
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})