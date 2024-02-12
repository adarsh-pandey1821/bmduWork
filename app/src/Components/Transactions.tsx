import { View, Text, FlatList, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import { toastError } from '../utils/toast.utils';
import { getReferalUsed } from '../Services/userReferal.service';
import { getUser } from '../Services/user.service';
import Headerr from '../ReuseableComp/Headerr';
import { getWallet } from '../Services/wallet.service';
import moment from 'moment';

const { height, width } = Dimensions.get('window')
export default function Transactions() {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const [userObj, setUserObj] = useState<any>({});
    const [balance, setBalance] = useState(0);
    const [wallet, setWallet] = useState([]);
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


    const focused = useIsFocused();

    const handleGetWallet = async () => {
        try {
            let { data: res }: any = await getWallet()
            if (res) {
                setWallet(res.transactions);
                setBalance(res?.balance);


            }

        }
        catch (err) {
            toastError(err)
        }

    }



    useEffect(() => {
        if (focused) {
            handleGetWallet();
        }
    }, [focused])

    return (
        <View>
            <Headerr secndheader={true} secondText={`Wallet balance : ${balance}`} label='Transactions' btn={false} />

            <FlatList
                data={wallet}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: hp(10) }}
                // onEndReached={() => setPage(prev => prev + 1)}
                // onEndReachedThreshold={0.5}
                renderItem={({ item, index }: any) => {
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
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Date and Time:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/icn5.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Types:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/MP.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Amount:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/MP.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Description:</Text>
                                    </View>

                                </View>
                                <View style={{ width: wp(50), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{index + 1}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{moment(item?.timeStamp).format("DD/MM/YYYY h:mm:ss a")}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.type}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.amount}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.message}</Text></Text>
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