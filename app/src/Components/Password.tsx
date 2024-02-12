import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Dimensions, Image, ImageBackground, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LoginContext, UserDataContext } from '../../App';
import { AuthContext } from '../../App';
import { loginUser, setJwt } from '../Services/user.service';
import { toastError } from '../utils/toast.utils';
const { height, width } = Dimensions.get('window')

const Password = (props: any) => {
    const mainFont = 'Montserrat-Regular';
    const mainFontBold = 'Montserrat-Bold';
    const navigation: any = useNavigation();
    const [hide, setHide] = useState(true);
    const [password, setPassword] = useState("");
    const [isAuthorized, setIsAuthorized] = useContext<any>(AuthContext)
    const [user, setUser] = useContext(LoginContext)
    const [userData, setUserData] = useContext(UserDataContext)

    const handleLogin = async () => {
        try {
            if (password == "") {
                toastError("Password is mandatory !!!")
                return
            }
            let obj = {
                email: props.route.params.data,
                password,
            }

            const { data: res }: any = await loginUser(obj);
            if (res.status == false) {
                throw new Error(res.error)
            }
            if (res.token) {
                await setJwt(res?.token, res?.user);
                setUser(res?.user?.role);
                setUserData(JSON.stringify(res?.user))
                setIsAuthorized(true);
            }
        }
        catch (err) {
            toastError(err)
        }
    }
    return (
        <View style={{ width: width }}>
            <ImageBackground source={require('../../assets/images/background_img.png')} resizeMode='contain' style={{ height: height, width: width, backgroundColor: "#1263AC" }} >
                <View style={{ backgroundColor: 'rgba(0,0,0,.75)', height: height, width: width, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7), fontFamily: mainFont }}>Login</Text>
                    <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>

                        {/* Password section >>>>>>>>>>>>>>>>>>>>>*/}
                        <Text style={{ color: '#fff' }}>Password</Text>
                        <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}>
                            <Image source={require('../../assets/images/Lock.png')}
                                style={{ height: wp(5.5), width: wp(5.5), resizeMode: 'contain', tintColor: 'grey' }} />
                            <TextInput
                                placeholder='Enter password'
                                placeholderTextColor="gray"
                                secureTextEntry={hide}
                                onChangeText={(e) => setPassword(e)}
                                value={password}
                                style={{ marginLeft: 5, width: wp(70) }}
                            />
                            <Pressable onPress={() => setHide(!hide)}>
                                <Image source={require('../../assets/images/Hide.png')}
                                    style={{ height: wp(5.5), width: wp(5.5), resizeMode: 'contain', tintColor: 'grey' }} />
                            </Pressable>
                        </View>
                        <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginTop: 8 }}><Text style={{ color: '#fff' }}>Forgot Password</Text></Pressable>


                        {/* Button section >>>>>>>>>>>>>>>>>> */}
                        <TouchableOpacity
                            onPress={() => handleLogin()}
                            style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Continue</Text>
                        </TouchableOpacity>

                        {/* Or Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                        {/* <View style={{ marginTop: hp(4), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: wp(40), borderBottomColor: 'white', borderBottomWidth: 1, }}></View>
                            <Text style={{ fontSize: hp(2), fontWeight: '600', color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Or</Text>
                            <View style={{ width: wp(40), borderBottomColor: 'white', borderBottomWidth: 1, }}></View>
                        </View> */}

                        {/* Via OTP Login Button >>>>>>>>>>>>>>>>>>>>>>>>> */}
                        {/* <TouchableOpacity
                            onPress={() => navigation.navigate("GetOTP")}
                            style={{ width: '100%', height: hp(6), borderColor: '#fff', borderWidth: 1, marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Login via OTP</Text>
                        </TouchableOpacity> */}

                        {/* Agreement Text >>>>>>>>>>>>>>>>>>>> */}
                        {/* <Text style={{ color: 'white', marginTop: hp(3), alignItems: 'center', justifyContent: 'center', fontFamily: 'AvenirNextLTPro-Regular' }}>By continuing, I agree to Fever99 <Text style={{ color: '#fff' }}>Conditions of Use </Text>and<Text style={{ color: '#fff' }}> Privacy Notice.</Text></Text> */}
                    </View>
                    <View>

                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

export default Password