import { View, Text, Dimensions, FlatList, Image, TouchableOpacity, TextInput, Animated, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { getUser } from '../Services/user.service';
import { addAppointments } from '../Services/appointments.service';
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob';
import { fileUpload } from '../Services/fileUpload.service';
import { getstateAndCities } from '../Services/stateCity.service';
import { SendNotificationForMeetingCreation } from '../Services/notificationSevice';
const { height, width } = Dimensions.get('window')

const BookVideo = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const focused = useIsFocused();
    const [isFocus, setIsFocus] = useState(false);
    const [isGenderFocused, setIsGenderFocused] = useState(false);
    const [dateModal, setDateModal] = useState(false);

    const [page, setPage] = useState(1);


    const [state, setstate] = useState("");
    const [city, setCity] = useState("");

    const [statesArr, setStatesArr] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);

    const [meetingConfirmation, setMeetingConfirmation] = useState(false);

    const Dropdwndata = [
        {
            label: 'Male', value: 'Male'
        },
        {
            label: 'Female', value: 'Female'
        },
        {
            label: 'Other', value: 'Other'
        },
    ]


    const [age, setAge] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [gender, setGender] = useState("");
    const [mode, setMode] = useState("Online");
    const [patientName, setPatientName] = useState("");
    const [paymentMode, setPaymentMode] = useState("Online");
    const [doctorObj, setDoctorObj] = useState(props?.route?.params?.doctor);

    const [bodyTemperature, setBodyTemperature] = useState("");
    const [bp, setBp] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [oxigne, setOxigne] = useState("");
    const [pulse, setPulse] = useState("");
    const [suger1, setSuger1] = useState("");
    const [suger2, setSuger2] = useState("");
    const [suger3, setSuger3] = useState("");

    const [cityIsFocused, setCityIsFocused] = useState(false);


    const [timeSlot, setTimeSlot] = useState(props?.route?.params?.doctor.timeSlot);
    const [timeSlotoffline, setTimeSlotoffline] = useState(props?.route?.params?.doctor.timeSlotoffline);

    const handleCreateBooking = async () => {
        try {
            console.log("here")
            if (gender == "") {
                toastError("Gender is mandatory !!!");
                return
            }
            if (dateTime == "") {
                toastError("Date is mandatory !!!");
                return
            }
            if (selectedTimeSlot == "") {
                toastError("Time Slot is mandatory !!!");
                return
            }
            if (patientName == "") {
                toastError("Patient Name is mandatory !!!");
                return
            }

            let userData = await getUser();
            let obj = {
                age,
                bodyTemperature,
                bp,
                dateTime,
                doctorId: doctorObj?._id,
                expertId: userData._id,
                files,
                gender,
                city,
                state,
                mode: "Video",
                oxigne,
                patientName,
                paymentMode: "Online",
                pulse,
                selectedTimeSlot,
                suger1,
                suger2,
                suger3,
                timeSlot,
                timeSlotoffline,
            }
            console.log("here 1")
            let { data: res } = await addAppointments(obj);
            console.log("here 2", JSON.stringify(res,null, 2))
            if (res.appointment.status == "pending") {
                console.log("here 3");
                console.log(JSON.stringify(res, null, 2), "res");
                // toastSuccess(res.message);
                setMeetingConfirmation(false);
                if (!res.status) {
                    toastError(res.message)
                    return
                }
                await SendNotificationForMeetingCreation({ appointment: res.appointment._id })
                if (res.appointment.appointmentCharge > 10) {
                    navigation.navigate("PayementScreen", { amount: res.appointment.appointmentCharge, appointmentId: res.appointment._id })
                }
                // navigation.goBack()
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const handleDocumentPicker = async () => {
        try {
            let file: any = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                allowMultiSelection: true,
                type: [DocumentPicker.types.images, DocumentPicker.types.doc, DocumentPicker.types.docx],
            });
            if (file) {

                for (const el of file) {
                    let formData = new FormData();
                    formData.append("file", el)
                    let { data: res } = await fileUpload(formData);
                    if (res.message) {
                        toastSuccess(res.message);
                        setFiles((prev: any) => [...prev, { fileName: res.data }])
                    }
                }
            }
        } catch (error) {
            toastError(error);
        }
    };



    useEffect(() => {
        if (focused) {
            HandleGetStatesAndCities()
        }
    }, [focused])
    const HandleGetStatesAndCities = async () => {
        try {
            let { data: res } = await getstateAndCities();
            if (res.data && res.data.length > 0) {
                setStatesArr([...res?.data?.map((el: any) => ({ label: el.state, value: el.state, cities: el.city }))])
            }
        }
        catch (err) {
            toastError(err)
        }
    }
    return (
        <View style={{ width: width, height: height, backgroundColor: 'white' }}>
            <Headerr secndheader={true} label='Appointment Details' />
            <View style={{ width: wp(95), height: height - hp(8), alignSelf: 'center', }}>

                <FlatList
                    data={[]}
                    renderItem={null}
                    contentContainerStyle={{ paddingBottom: hp(5) }}
                    ListHeaderComponent={<View>
                        {
                            page == 1 &&
                            <>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Date:</Text>
                                        <Pressable onPress={() => setDateModal(true)}>
                                            <TextInput placeholder='Select Date' editable={false} onChangeText={(e) => setDateTime(e)} value={dateTime} style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                        </Pressable>
                                    </View>
                                    <View style={{ width: wp(45) }} >
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Select Slot:</Text>
                                        {/* {renderLabel()} */}
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue', borderWidth: 0.5, }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={timeSlot}
                                            // search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select Slot'
                                            // searchPlaceholder="Search..."
                                            value={selectedTimeSlot}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={(item: any) => {
                                                setSelectedTimeSlot(item.value);
                                                setIsFocus(false);
                                            }}
                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Name:</Text>
                                        <TextInput onChangeText={(e) => setPatientName(e)} value={patientName} placeholderTextColor="#8E8E8E" placeholder='Patient Name' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>
                                    <View style={{ width: wp(45) }} >
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Gender:</Text>
                                        <Dropdown
                                            style={[styles.dropdown1, isGenderFocused && { borderColor: 'blue', borderWidth: 0.5, }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={Dropdwndata}
                                            // search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select Gender'
                                            value={gender}
                                            onFocus={() => setIsGenderFocused(true)}
                                            onBlur={() => setIsGenderFocused(false)}
                                            onChange={item => {
                                                setGender(item.value);
                                                setIsGenderFocused(false);
                                            }}

                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Age:</Text>
                                        <TextInput onChangeText={(e) => setAge(e)} value={age} keyboardType='number-pad' placeholderTextColor="#8E8E8E" placeholder='Patient Age' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>State:</Text>
                                        <Dropdown
                                            style={[styles.dropdown]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={statesArr}
                                            // search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select State'
                                            // searchPlaceholder="Search..."
                                            value={state}
                                            // onFocus={() => setIsFocus(true)}
                                            // onBlur={() => setIsFocus(false)}
                                            onChange={(item: any) => {
                                                setstate(item.value)
                                                setCityArr([...item.cities.map((el: any) => ({ label: el, value: el }))])
                                                setIsFocus(false);
                                            }}
                                        />
                                    </View>
                                </View>

                                {
                                    cityArr && cityArr.length > 0 &&
                                    <>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>City:</Text>

                                        <Dropdown
                                            style={[styles.dropdown, { width: wp(95) }, cityIsFocused && { borderColor: 'blue', borderWidth: 0.5, }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={cityArr}
                                            // search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select City'
                                            // searchPlaceholder="Search..."
                                            value={city}
                                            onFocus={() => setCityIsFocused(true)}
                                            onBlur={() => setCityIsFocused(false)}
                                            onChange={(item: any) => {
                                                setCity(item.value);
                                                setCityIsFocused(false);
                                            }}
                                        />
                                    </>
                                }

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(2), width: wp(95) }}>
                                    <View style={{ width: wp(95) }}>
                                        <TouchableOpacity onPress={handleDocumentPicker}>
                                            <Text style={{ color: 'black', fontFamily: mainFontmedium, fontSize: hp(1.8) }}>Upload File</Text>
                                            <View style={{ width: wp(95), height: hp(5.5), borderColor: 'gray', borderWidth: 0.7, marginTop: hp(1), borderStyle: 'dashed', justifyContent: 'space-between', alignItems: 'center', paddingLeft: wp(2), paddingRight: wp(2), flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: mainFont, fontSize: hp(1.4), color: 'gray' }}>{(files && files.length > 0) ? files.reduce((acc, el, index) => acc + `${el.fileName} ${(index != files.length - 1) ? "," : ""}`, "") : "Select JPG,PDF,PNG Format"}</Text>
                                                <Image source={require('../../assets/images/upld.png')}
                                                    style={{ height: wp(6), width: wp(6), resizeMode: 'contain' }} />
                                            </View>
                                        </TouchableOpacity>
                                        {/* <TextInput  style={{height:hp(5.5), width:wp(45), marginTop:hp(1), backgroundColor:'#F2F2F2E5', borderRadius:5}}/> */}
                                    </View>
                                </View>
                            </>
                        }
                        {
                            page == 2 &&
                            <>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>BP <Text style={{ color: "black" }}>mm of Hg</Text> :</Text>
                                        <TextInput onChangeText={(e) => setBp(e)} value={bp} placeholderTextColor="#8E8E8E" placeholder='Enter BP' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>

                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Pulse  <Text style={{ color: "black" }}>Per minute</Text> :</Text>
                                        <TextInput onChangeText={(e) => setPulse(e)} value={pulse} placeholderTextColor="#8E8E8E" placeholder='Enter Pulse' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Body Temperature  <Text style={{ color: "black" }}>°F</Text> :</Text>
                                        <TextInput onChangeText={(e) => setBodyTemperature(e)} value={bodyTemperature} placeholderTextColor="#8E8E8E" placeholder='Enter Temperature' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>

                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>SpO2 % :</Text>
                                        <TextInput onChangeText={(e) => setOxigne(e)} value={oxigne} placeholderTextColor="#8E8E8E" placeholder='Enter SpO2' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Fasting Blood Sugar  <Text style={{ color: "black" }}>mg/dL</Text> (FBS):</Text>
                                        <TextInput onChangeText={(e) => setSuger1(e)} value={suger1} placeholderTextColor="#8E8E8E" placeholder='Fasting Blood Sugar (FBS)' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>

                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Postprandial Blood Sugar <Text style={{ color: "black" }}>mg/dL</Text> (PPBS):</Text>
                                        <TextInput onChangeText={(e) => setSuger2(e)} value={suger2} placeholderTextColor="#8E8E8E" placeholder='Postprandial (PPBS)' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(95) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Random Blood Sugar<Text style={{ color: "black" }}> mg/dL (RBS)</Text> :</Text>
                                        <TextInput onChangeText={(e) => setSuger3(e)} value={suger3} placeholderTextColor="#8E8E8E" placeholder='Random Blood Sugar' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                                    </View>
                                </View>
                            </>
                        }

                    </View>}
                />
                <View style={{ flexDirection: 'row', marginTop: hp(2), alignSelf: 'baseline', paddingTop: hp(1), paddingBottom: hp(1), width: wp(95) }}>
                    {
                        page == 1 ?
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{ width: wp(45), height: hp(5), backgroundColor: '#B0B0B0', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Close</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => setPage(1)}
                                style={{ width: wp(45), height: hp(5), backgroundColor: '#B0B0B0', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Go back</Text>
                            </TouchableOpacity>

                    }

                    {
                        page == 1 ?
                            <TouchableOpacity onPress={() => setPage(2)} style={{ width: wp(45), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Next</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setMeetingConfirmation(true)} style={{ width: wp(45), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Proceed</Text>
                            </TouchableOpacity>

                    }



                </View>


            </View>

            <Modal
                isVisible={dateModal}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackButtonPress={() => setDateModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setDateModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>
                    <Calendar
                        onDayPress={day => {
                            setDateTime(day.dateString);
                            setDateModal(false)
                        }}
                        minDate={`${new Date()}`}
                    />
                </View>
            </Modal>

            <Modal
                isVisible={meetingConfirmation}
                animationIn={'zoomIn'}
                animationOut={'zoomOut'}
                onBackButtonPress={() => setMeetingConfirmation(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), height: hp(90), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, }}>
                    <View style={{ height: hp(6), width: wp(85), backgroundColor: maincolor, borderTopRightRadius: 5, borderTopLeftRadius: 5, justifyContent: 'center', paddingLeft: wp(5) }}>
                        <Text style={{ color: 'white', fontSize: hp(1.5), }}>CONSENT FORM FOR TELECOMMUNICATION </Text>
                        {/* <Text style={{ color: 'white', fontSize: hp(1.5), }}>दूरसंचार के लिए सहमति </Text> */}
                    </View>
                    <ScrollView contentContainerStyle={{ marginTop: 15, width: wp(75), alignSelf: 'center', paddingBottom: 25 }}>
                        <Text style={{ color: 'black', fontSize: hp(1.5), marginBottom: 10 }}>1. Fever99 is offering telemedicine or video consultation where patients are not being able to reach the hospital.
                            A video or telemedicine consultation can never be compared to a normal in-hospital consultation where the doctor is able to physically examine the patient.</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.5), marginBottom: 10 }}>2. You are advised to come to the hospital for consults whenever you are in a position for the same. If the consultation cannot wait, then only you should opt for a telemedicine or video consultation. </Text>
                        <Text style={{ color: 'black', fontSize: hp(1.5), marginBottom: 10 }}>3. You are advised to confirm the diagnosis, treatment and prescription whenever you are able to come to the hospital for a physical consult. In case your symptoms/condition does not improve, immediately reach the nearest hospital.</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.5), marginBottom: 10 }}>4. ⁠By accepting telemedicine consultation , you agree and accept that the tele-consultants/doctors and all personnel directly or indirectly involved with any part of the Telemedicine set up shall not be held responsible in the unlikely event of an error in diagnosis or management due to the occurrence of sub optimal technical conditions. While every attempt will be made to ensure ideal conditions, unforeseen situations may occur.</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.5), marginBottom: 10 }}>5. Fever99 and/or its doctors shall not be responsible for complete accuracy of telemedicine consultation, limited in its scope as it is, with no physical examination of the patient being possible. While every attempt will be made to ensure comprehensiveness of the consultation, unforeseen situations may arise. Your accepting telemedicine consultation will be taken as your consent for a telemedicine consult with its ingrained limitations.</Text>
                        {/* <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- डॉक्टर अपनी समझ या बताई गई समस्याओं के अनुसार आपको सलाह देगा, लेकिन कई लक्षण बिना आत्म-जांच के छूट सकते हैं, ऐसी स्थिति में सुझाव देने वाले डॉक्टर को दोषी नहीं ठहराया जा सकता है।</Text> */}
                        {/* <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- काउंटर पर मिलने वाली दवाओं के लिये ही प्रिसक्रिप्शन दिया जाएगा।</Text> */}
                        {/* <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- ⁠यह सलाह किसी भी चिकित्सकीय क़ानूनी अद्देश्यों के लिए मान्य नहीं है।</Text> */}
                        {/* <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- यह सुविधा आपातकालीन स्थितियों के लिए नहीं है, किसी भी आपातकालीन सेवा के लिए तुरंत नज़दीकी डॉक्टर से संपर्क करें !!</Text> */}


                        <View style={{ flexDirection: 'row', marginTop: hp(2), alignSelf: 'center' }}>
                            {/* <TouchableOpacity
                                    onPress={() => setMeetingConfirmation(false)}
                                    style={{ width: wp(25), height: hp(5), backgroundColor: '#BD2626', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: hp(1.8), color: 'white', }}>Close</Text>
                                </TouchableOpacity> */}

                            <TouchableOpacity onPress={() => handleCreateBooking()} style={{ width: wp(25), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', }}>I Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: hp(1),
        width: wp(45),
        backgroundColor: '#F2F2F2E5',
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        // left: 22,
        // top: 8,
        // zIndex: 999,
        // paddingHorizontal: 8,
        fontSize: hp(1.7),
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'gray',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#8E8E8E'
    },
    dropdown1: {
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: hp(1),
        width: wp(95),
        backgroundColor: '#F2F2F2E5',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#8E8E8E'
    },
});

export default BookVideo