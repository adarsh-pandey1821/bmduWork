import { View, Text, FlatList, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import { toastError } from '../utils/toast.utils';
import { getReferalUsed } from '../Services/userReferal.service';
import { getUser } from '../Services/user.service';
import Headerr from '../ReuseableComp/Headerr';

const { height, width } = Dimensions.get('window')
export default function Referal() {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const [userObj, setUserObj] = useState<any>({});
    const [referalArr, setReferalArr] = useState<any[]>([
        {
            name: "asd",
            email: "a@a.com",
            gender: "Female",
            service: "physiotherapy"
        },
        {
            name: "asd",
            email: "a@a.com",
            gender: "Female",
            service: "physiotherapy"
        },
        {
            name: "asd",
            email: "a@a.com",
            gender: "Female",
            service: "physiotherapy"
        }
    ]);
    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData)
        }
    }

    const focused = useIsFocused();
    const handleGetReferal = async () => {
        try {
            let { data: res } = await getReferalUsed()
            if (res.data) {
                // setReferalArr(res.data)
            }
        } catch (err) {
            toastError(err)
        }
    }



    useEffect(() => {
        if (focused) {
            handleGetReferal();
            handleGetAndSetUser();
        }
    }, [focused])

    return (
        <View>
            <Headerr secndheader={true} referalCode={userObj?.refrelCode} label='Referal' btn={false} />

            <FlatList
                data={referalArr}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: hp(10) }}
                // onEndReached={() => setPage(prev => prev + 1)}
                // onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: width, paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 3, marginBottom: hp(2), }}>
                            <View style={{ width: width, flexDirection: 'row' }}>
                                <View style={{ width: wp(40), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require('../../assets/images/icn5.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>S.no:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/icn3.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Name:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/icn5.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Email:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/MP.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Gender:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/MP.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Speciality:</Text>
                                    </View>

                                </View>
                                <View style={{ width: wp(50), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{index + 1}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item.name}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.email}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.gender}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item.service}</Text></Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}