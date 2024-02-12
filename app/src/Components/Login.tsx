import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../../App';
import { toastError } from '../utils/toast.utils';
const { height, width } = Dimensions.get('window')

const Login = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const [agree, setAgree] = useState(false)
    const [user, setUser] = useContext(LoginContext)
    const [email, setEmail] = useState("");



    const handleRedirectToNextScreen = () => {
        if (email == "") {
            toastError("Email is mandatory !!!")
            return
        }
        navigation.navigate("Password", { data: email })
    }
    return (
        <View style={{ width: width, alignItems: 'center', justifyContent: 'center', height: height }}>
            <ImageBackground source={require('../../assets/images/background_img.png')} resizeMode='contain' style={{ height: height, width: width, backgroundColor: "#1263AC" }} >
                <View style={{ backgroundColor: 'rgba(0,0,0,.65)', height: height, width: width, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Image source={require('../../assets/img/img13.png')}
        style={{ height: wp(60), width: wp(60), resizeMode: 'cover', alignSelf: 'center', marginTop: hp(8) }} /> */}

                    <Text style={{ fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7), fontFamily: mainFont }}>Login</Text>
                    <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>

                        {/* Email section >>>>>>>>>>>>>>>>>>>>>*/}
                        <Text style={{ color: 'white' }}>Mobile Number/Email</Text>
                        <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}>
                            <Image source={require('../../assets/images/Mail.png')}
                                style={{ height: wp(5.5), width: wp(5.5), resizeMode: 'contain', tintColor: 'grey' }} />
                            <TextInput placeholder='Enter Mobile Number or Email'
                                placeholderTextColor="gray"

                                onChangeText={(e) => setEmail(e)}
                                value={email}
                                style={{ marginLeft: 5, width: wp(70) }} />

                        </View>

                        {/* Button section >>>>>>>>>>>>>>>>>> */}
                        <TouchableOpacity onPress={() => handleRedirectToNextScreen()} style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Continue</Text>
                        </TouchableOpacity>

                        {/* Or Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                        <View style={{ marginTop: hp(4), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: wp(40), borderBottomColor: 'white', borderBottomWidth: 1, }}></View>
                            <Text style={{ fontSize: hp(2), fontWeight: '600', color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Or</Text>
                            <View style={{ width: wp(40), borderBottomColor: 'white', borderBottomWidth: 1, }}></View>
                        </View>

                        {/* Via OTP Login Button >>>>>>>>>>>>>>>>>>>>>>>>> */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Register")}
                            style={{ width: '100%', height: hp(6), borderColor: '#fff', borderWidth: 1, marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Register</Text>
                        </TouchableOpacity>


                    </View>
                    <View>

                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

export default Login