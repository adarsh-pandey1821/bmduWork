import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import Headerr from '../ReuseableComp/Headerr'

const { height, width } = Dimensions.get('window')

export default function ReturnandRefundPolicy() {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation = useNavigation()
    return (
        <View style={{ width: width, height: height, }}>
            {/* <Header secondheader={true} label='Privacy & Policy' buttonshow={true} /> */}
            <Headerr secndheader={true} label='Cancellation & Refund Policy' />
            <ScrollView style={{ width: wp(95), alignSelf: 'center', marginBottom: hp(3) }}>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>Fever99.com will refund full amount for cancellation of an appointment if cancellation is done 6 hours before the scheduled time. If the appointment is cancelled within 6 hours of the scheduled time then no refund would be provided.</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>The appointment can be rescheduled till 1 hour before the appointment time at no extra cost by calling the customer care. If the appointment is rescheduled then it can not be cancelled anytime. However, the appointment can be rescheduled maximum 2 times.</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>In case of refund, Your money would be refunded to your account by reversal of transaction as per the payment mode within 15 working days of the cancellation of an appointment</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>For any delay in refunding the money due to unforeseen conditions beyond the control of Fever99 E-clinic. Fever99 Eclinic would not be liable to pay any extra amount as compensation for delay</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black', fontWeight: "700" }}>Contact Details:</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>Visit us at: Fever99 E-clinic, Shriram Complex,Near SPR Society ,Sector 82 Faridabad,Haryana Website: https://www.fever99.com</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>Email: info@fever99.com</Text>
                <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>M:+91 6262808062</Text>
            </ScrollView>
        </View>
    )
}