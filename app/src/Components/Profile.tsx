import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AuthContext } from '../../App';
import Headerr from '../ReuseableComp/Headerr';
import { generateFilePath } from '../Services/url.service';
import { deleteJwt, getUser, setUser, updateUserStatus } from '../Services/user.service';
import { Roles } from '../utils/constant';
import { toastError } from '../utils/toast.utils';
import { ScrollView } from 'react-native';

const { height, width } = Dimensions.get('window')

const Profile = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const mainFontmedium = 'Montserrat-Medium'
  const maincolor = '#1263AC'
  const navigation: any = useNavigation()
  const [bookmodal, setBookmodal] = useState(false)
  const [isAuthorized, setIsAuthorized] = useContext<any>(AuthContext)
  const focused = useIsFocused()
  const [userObj, setUserObj] = useState<any>({});
  const [count, setCount] = useState(0);

  const handleLogout = async () => {
    try {
      await deleteJwt();
      setIsAuthorized(false);
    }
    catch (err) {
      toastError(err)
    }
  }

  const handleGetAndSetUser = async () => {
    let userData = await getUser();

    if (userData) {
      setUserObj(userData)
    }


  }


  useEffect(() => {
    if (focused) {
      handleGetAndSetUser()
    }
  }, [focused, count])

  useEffect(() => {

  }, [focused, userObj])

  const handleChangeStatus = async () => {
    try {

      let tempStatus = userObj?.userStatus

      if (tempStatus == "online") {
        tempStatus = "offline"
      }
      else {
        tempStatus = "online"
      }


      let { data: res } = await updateUserStatus(userObj?._id, { userStatus: tempStatus, })
      if (res) {
        await setUser(res.data);
        setUserObj({ ...res.data });
        //     setCount(prev => prev + 1)
      }
    }
    catch (err) {
      toastError(err)
    }
  }


  return (
    <View style={{ width: width, height: height, backgroundColor: 'white' }}>
      <Headerr secndheader={true} label='Profile' />
      <ScrollView contentContainerStyle={{paddingBottom:80, width: wp(95), alignSelf: 'center' }}>
        <View style={{ width: wp(95), marginTop: hp(3), flexDirection: 'row' }}>
          <View style={{ position: "relative" }}>
            <Image source={(userObj?.image && userObj?.image != "" && userObj?.image.includes("file")) ? { uri: generateFilePath(userObj?.image) } : require('../../assets/images/user_frame.png')}
              style={{ height: wp(20), width: wp(20) }} />
            {
              userObj.role == Roles.DOCTOR &&
              <View style={{ position: "absolute", top: 5, right: 5, backgroundColor: userObj?.userStatus == "online" ? "green" : "red", height: 10, width: 10, borderRadius: 10 }}></View>
            }
          </View>
          <View style={{ height: wp(20), marginLeft: wp(3) }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>{userObj?.name}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditiProfile')}
                style={{ marginLeft: wp(40) }}>
                <Image source={require('../../assets/images/Edit.png')}
                  style={{ height: wp(5), width: wp(5) }} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
              <Image source={require('../../assets/images/Mail1.png')}
                style={{ height: wp(4), width: wp(4) }} />
              <Text style={{ color: '#4A4D64', fontSize: hp(1.5), fontFamily: mainFontmedium, marginLeft: wp(2), }}>{userObj?.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
              <Image source={require('../../assets/images/Calling.png')}
                style={{ height: wp(4), width: wp(4) }} />
              <Text style={{ color: '#4A4D64', fontSize: hp(1.5), fontFamily: mainFontmedium, marginLeft: wp(2), }}>{userObj?.mobile}</Text>
            </View>
            {
              userObj.role == Roles.DOCTOR &&
              <Pressable style={{ borderWidth: 1, borderColor: userObj?.userStatus == "online" ? "green" : "red", borderRadius: 10, width: 100, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 }} onPress={() => handleChangeStatus()}>
                <Text>Set {userObj?.userStatus == "online" ? "Offline" : "Online"}</Text>
              </Pressable>
            }


            {
              userObj?.address && userObj?.address != "" && userObj?.city && userObj?.city != "" && userObj?.state && userObj?.state != "" && userObj?.pincode && userObj?.pincode != "" &&
              <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
                <Image source={require('../../assets/images/Location2.png')}
                  style={{ height: wp(4), width: wp(4) }} />
                <Text style={{ color: '#4A4D64', fontSize: hp(1.5), fontFamily: mainFontmedium, marginLeft: wp(2), }}>{userObj?.address} , {userObj?.city} , {userObj?.state} - {userObj?.pincode}</Text>
              </View>
            }

          </View>


        </View>

        <View style={{ width: wp(95), marginTop: hp(7) }}>



          <TouchableOpacity
            onPress={() => navigation.navigate('Appointment')}
            style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/history.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Appointment History</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PAC')} style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/Shield.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Privacy Policy</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>


          <TouchableOpacity
             onPress={() => navigation.navigate('Settings')}  style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/Shield.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Setting</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>


          <TouchableOpacity
             onPress={() => navigation.navigate('EditiProfile')}  style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/Shield.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Edit Profile</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>









          <TouchableOpacity
            onPress={() => navigation.navigate('TAC')} style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/tac.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Terms & Conditions</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ReturnandRefundPolicy')} style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/tac.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Cancellation & Refund Policy</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>


          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Support')}
            style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/Headphones.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Help & Support</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity> */}


          <TouchableOpacity
            onPress={() => navigation.navigate('ContactUs')} style={{ marginTop: hp(2), width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/tac.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}>Contact Us</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: hp(2), width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/tac.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}>Share App</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>
          {/* {
            userObj?.role !== Roles.DOCTOR &&
            <TouchableOpacity
              onPress={() => navigation.navigate('Ref')} style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
              <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
                <Image source={require('../../assets/images/refer.png')}
                  style={{ height: wp(7), width: wp(7) }} />
                <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Referal User</Text>
              </View>
              <Image source={require('../../assets/images/Right.png')}
                style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
            </TouchableOpacity>
          } */}

          <TouchableOpacity
            onPress={() => setBookmodal(true)}
            style={{ width: wp(95), flexDirection: 'row', backgroundColor: '#E8E6E6', height: hp(5.5), justifyContent: 'space-between', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), borderRadius: wp(2), marginTop: hp(2) }}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Image source={require('../../assets/images/Logout.png')}
                style={{ height: wp(7), width: wp(7) }} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Logout</Text>
            </View>
            <Image source={require('../../assets/images/Right.png')}
              style={{ height: wp(7), width: wp(7), resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity style={{ alignSelf: 'center', marginTop: hp(10) }}>
          <Text style={{ fontSize: hp(1.7), color: '#1263AC', textDecorationLine: 'underline', fontFamily: mainFont }}>Terms and Conditions & Privacy Policy</Text>
        </TouchableOpacity> */}
      </ScrollView>
      <Modal
        isVisible={bookmodal}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackButtonPress={() => setBookmodal(false)}
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
          <TouchableOpacity
            onPress={() => setBookmodal(false)}
            style={{ alignSelf: 'flex-end' }}>
            <Image source={require('../../assets/images/close.png')}
              style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
          </TouchableOpacity>
          <View style={{ height: wp(14), width: wp(14), backgroundColor: '#D8D8D8E5', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: wp(8) }}>
            <Image source={require('../../assets/images/logouticn.png')}
              style={{ height: wp(9), width: wp(9), resizeMode: 'contain' }} />
          </View>
          <Text style={{ color: 'black', fontFamily: mainFontmedium, fontSize: hp(2), marginTop: hp(3), textAlign: 'center' }}>Are you sure
            you want to logout ?</Text>
          <View style={{ width: wp(75), alignSelf: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            <TouchableOpacity
              // onPress={() => navigation.navigate('Login')}
              onPress={() => setBookmodal(false)}
              style={{ height: hp(5), marginTop: hp(2), width: wp(35), borderColor: maincolor, alignSelf: 'center', borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 0.8 }}>
              <Text style={{ color: maincolor, fontFamily: mainFont, fontSize: hp(2) }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleLogout()}
              style={{ height: hp(5), marginTop: hp(2), width: wp(35), backgroundColor: maincolor, alignSelf: 'center', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>Logout</Text>
            </TouchableOpacity>

           



          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Profile