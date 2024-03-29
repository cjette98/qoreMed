import React, { useState, useEffect } from 'react'
import {ActivityIndicator,FlatList, StyleSheet, Text, View,SafeAreaView, ScrollView,TouchableOpacity, Image,Dimensions} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


import Swipeable from 'react-native-gesture-handler/Swipeable';


// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign'

import PatientEmpty from '../assets/images/PatientDoctor.jpg'
import notes from '../assets/icons/note.png'

//Size Screen

const { width, height } = Dimensions.get("window");
const widthSize = width;
const heightSize = height;
const cardWidth = width / 2 - 20;

import  FabAddClinic from './components/FabAddClinic'

import URL from '../api'

const ClinicList = ({ navigation }) => {

    const [ClinicList, setClinicList] = useState([])
    const [loading,setLoading] = useState(true)
    const numColumns = 3;
    const formatData = (ClinicList, numColumns) => {
        const totalRows = Math.floor(ClinicList.length / numColumns)
        let totalLastRow = ClinicList.length - (totalRows * numColumns)

        while (totalLastRow !== 0 && totalLastRow !== 3) {
            ClinicList.push({ key: 'blank', empty: true })
            totalLastRow++

        }

        return ClinicList
    }


    useEffect( () => {
        const unsubscribe = navigation.addListener('focus', async() => {
            let token;
            token = await AsyncStorage.getItem('userToken');
            fetch(URL + 'api/v1/clinics', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            })
                .then((response) => response.json())
                .then((json) => {
                     console.log(json);
                   if(json.data.length > 0) {
                    setLoading(false)
                    setClinicList(json.data)
                   }else{
                    setLoading(false)
                   }

                })
                .catch((error) => {

                    console.log(error);

                });
        });
        return unsubscribe;
    }, [navigation])

    const GotoClinicDetails = (data) => {
        navigation.navigate('ClinicDetails',data)
    }

    const userTap = () => {
      navigation.navigate('ClinicAddNew')
    }

    const ClinicListContent = () => {
        const renderItem = ({ item, i }) => {

            if (item.empty) {
                return (
                    <TouchableOpacity style={[styles.ItemContainer, styles.ItemInvisible]}>
                        <View>
                        
                        </View>
                    </TouchableOpacity>

                )

            }


            return (
                <>
                    <TouchableOpacity onPress={() => GotoClinicDetails(item)} style={styles.ItemContainer}>
                       
                       
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            
                        <Text numberOfLines={3}  style={{ textAlign: 'center', fontWeight:'700', fontSize:15}}>{item.name}</Text>
                    

                        </View>
                    </TouchableOpacity>
                </>
            )
        }



        return (
            <View style={{flex: 1}}>
                <FlatList


                    contentContainerStyle={{paddingBottom: 50}}
                    data={formatData(ClinicList, numColumns)}
                    vertical
                    showsVerticalScrollIndicator={false}
                    numColumns={numColumns}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}

                />

            </View>
        )
    }

    if (loading == true) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent:'center',alignItems: 'center'}}>
                 <ActivityIndicator size="large" color="#2196f3" />
            </View>
        )
    }



    return (
        <>
        <SafeAreaView
                style={{ padding: 10, backgroundColor: 'white' }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <IconION name="arrow-back" size={20} color='black' />
                        </TouchableOpacity>

                    </View>

                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16 }}>My Clinics</Text>
                    </View>

                    <View>
                  
                    </View>


                </View>
            </SafeAreaView>

        <View style={{flex:1, padding:10, backgroundColor: 'white', justifyContent: ClinicList.length < 1 ? 'center' : null}}>
           {ClinicList.length < 1 ? (
            <View>
                    <Image source={PatientEmpty} style={{width: '100%', height: 200}}/>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Clinic Record is Empty</Text>
                    <Text style={{textAlign: 'center',marginTop:2}}>To add, just tap the plus button</Text>
                </View>
           ) : ClinicListContent()}

        <FabAddClinic tap={userTap} />

        </View>
        </>
    )
}

export default ClinicList

const styles = StyleSheet.create({
    ItemContainer: {
        backgroundColor: 'white',
        flex: 1,
        height: widthSize / 3,
        margin: 5,
        borderRadius: 10,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding:5,
        borderColor: "rgba(33,150,243, 0.3)",
        borderWidth: 1,
        


    },
    ItemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0,
        borderWidth: 0,
    }
})
