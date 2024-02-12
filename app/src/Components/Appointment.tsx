import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import RNFetchBlob from 'rn-fetch-blob';
import { LoginContext } from '../../App';
import Headerr from '../ReuseableComp/Headerr';
import { getAppointments, updateAppointmentCallStatus, updateAppointments } from '../Services/appointments.service';
import { SendNotification } from '../Services/notificationSevice';
import { addSupportComplaint } from '../Services/support.service';
import url, { generateFilePath } from '../Services/url.service';
import { getUser } from '../Services/user.service';
import { Roles, appointmentStatus, consultationMode } from '../utils/constant';
import { toastError, toastSuccess } from '../utils/toast.utils';

const { height, width } = Dimensions.get('window')

const Appointment = () => {
    const [loading, setLoading] = useState(true);

    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()

    const [meetingConfirmation, setMeetingConfirmation] = useState(false);
    const [user, setUser] = useContext(LoginContext)

    const [userObj, setUserObj] = useState<any>("");
    const [dateModal, setDateModal] = useState(false);
    const [dateToModal, setDateToModal] = useState(false);

    const [selectedMeeting, setSelectedMeeting] = useState<any>({});




    const [appointmentsArr, setAppointmentsArr] = useState<any[]>([]);
    const [lastPageReached, setLastPageReached] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const focused = useIsFocused()

    const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [complaintModal, setComplaintModal] = useState(false);


    const [fromDate, setFromDate] = useState("");
    const [toDate, settoDate] = useState("");

    const openSettings = () => {
        Linking.openSettings();
    };
    const HandleGetAppointmentsPaginated = async (pageValue: any) => {
        try {
            console.log("refreshing")
            let queryString = `page=${pageValue}&limit=${limit}`

            if (fromDate && fromDate != "") {
                queryString = `${queryString}&fromDate=${fromDate}`
            }
            if (toDate && toDate != "") {
                queryString = `${queryString}&toDate=${toDate}`
            }
            console.log(queryString,"limit")

            let { data: res } = await getAppointments(queryString);
            
            if (res.data) {
                console.log(pageValue,"pageValue")
                if(pageValue == 1){
                    setAppointmentsArr([...res.data])
                }
                else{
                    setAppointmentsArr((prev: any) => [...prev, ...res.data])
                }
            }
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            toastError(err)
        }
    }



    const HandleGetAppointmentsWithFilterPaginated = async () => {
        try {
            setPage(1);
            let queryString = `page=${1}&limit=${limit}`

            if (fromDate && fromDate != "") {
                queryString = `${queryString}&fromDate=${fromDate}`
            }
            if (toDate && toDate != "") {
                queryString = `${queryString}&toDate=${toDate}`
            }
            console.log("qyert")
            let { data: res } = await getAppointments(queryString);
            if (res.data) {
                setAppointmentsArr([...res.data]);
            }
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            toastError(err)
        }
    }


    useEffect(() => {
        if (focused) {
            
            HandleGetAppointmentsPaginated(1)
            let tempInterval = setInterval(() => HandleGetAppointmentsPaginated(1), 20000)
            return () => { setAppointmentsArr([]); setPage(1); clearInterval(tempInterval) }
        }
    }, [focused])






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
    }, [focused])


    const handlechangeAppointmentStatus = async (id: string, statusString: string) => {
        try {
            let obj = {
                status: statusString,
            }
            let { data: res } = await updateAppointments(id, obj);
            if (res) {
                setPage(1);
                setFromDate("");
                settoDate("");
                setAppointmentsArr([]);
                HandleGetAppointmentsWithFilterPaginated()
                toastSuccess(res.message)
            }
        } catch (error) {
            toastError(error)
        }
    }


    const handleJoinMeeting = async (id: string, callProgress: boolean) => {
        try {
            let obj = {
                callInprogress: callProgress
            }
            let { data: res } = await updateAppointmentCallStatus(id, obj);
            if (res) {
                setPage(1);
                setAppointmentsArr([])
                // console.log(JSON.stringify(res, null, 2), "asd22222")
                if (callProgress) {
                    // Linking.openURL('https://fever99.daily.co/Consult');

                    let { data: notificationRes } = await SendNotification({ appointmentId: id, userId: userObj?._id })
                    if (notificationRes) {
                        setMeetingConfirmation(false)
                        navigation.navigate("Meeting", { data: id })
                    }

                }
                else {
                    handlechangeAppointmentStatus(id, appointmentStatus.COMPLETED)
                }
            }
        } catch (error) {
            toastError(error)
        }
    }



    const handleDownloadPrescription = async (id: string) => {
        try {
            if (Platform.OS == 'android') {
                const android = RNFetchBlob.android;
                RNFetchBlob.config({
                    fileCache: true,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: RNFetchBlob.fs.dirs.DownloadDir + '/Prescription' + '.pdf',
                        mime: 'application/pdf',
                        description: 'File downloaded by download manager.',
                    },
                })
                    .fetch('GET', `${url}/prescription/${id}`, {
                        responseType: "blob",
                    })
                    .then(res => {
                        android.actionViewIntent(res.path(), 'application/pdf');
                        toastSuccess("Prescription Downloaded")
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                toastError('Not Configured');
            }

        } catch (error) {
            toastError(error)
        }
    }



    const handleAddComplaint = async () => {
        try {

            if (selectedAppointmentId == "") {
                toastError("Please select an appointment !!!")
                return;
            }

            if (title == "") {
                toastError("Please enter title !!!")
                return;
            }
            if (details == "") {
                toastError("Please enter message !!!")
                return;
            }
            let obj = {
                title,
                details,
                appointmentId: selectedAppointmentId
            }
            let { data: res } = await addSupportComplaint(obj);
            if (res.message) {
                toastSuccess(res.message);
                setComplaintModal(false);
            }
        } catch (err) {
            toastError(err)
        }
    }


    return (
        <View style={{ height: height, width: width, backgroundColor: '#F1F8FF' }}>
            <Headerr secndheader={true} label='Appointment' btn={(userObj?.role == Roles.PATIENT || userObj?.role == Roles.FRANCHISE) ? true : false} btnlbl='Book Appointment' />
            {
                user == 'DOCTOR' &&
                <View style={{ width: wp(95), alignSelf: 'center', marginTop: hp(1), flexDirection: 'row', marginBottom: hp(1), justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setDateModal(true)} style={{ width: wp(35) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFont }}>From Date:</Text>
                        <TextInput editable={false} placeholder='dd/mm/yyyy' value={fromDate} placeholderTextColor={'gray'}
                            style={{ height: hp(6), width: wp(35), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 5 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDateToModal(true)} style={{ width: wp(35) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFont }}>To Date:</Text>
                        <TextInput editable={false} placeholder='dd/mm/yyyy' value={toDate} placeholderTextColor={'gray'}
                            style={{ height: hp(6), width: wp(35), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 5 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { HandleGetAppointmentsWithFilterPaginated(); setPage(1); }} style={{ width: wp(18), backgroundColor: maincolor, height: hp(6), marginTop: hp(3.2), borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: hp(1.7), fontFamily: mainFont }}>Apply</Text>
                    </TouchableOpacity>
                </View>
            }


            <FlatList
                data={appointmentsArr}
                ListEmptyComponent={
                    <>
                    {
                        loading ? 
                            <ActivityIndicator color={maincolor} size={"large"}/>
                        :

                    <Text style={{display:"flex", textAlign:"center", marginTop:40}}>No appointments found</Text>
                    }
                    </>
                }
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: hp(10) }}
                // onStartReached={() => { setPage(prev => prev - 1); HandleGetAppointmentsPaginated(page - 1) }}
                onEndReached={() => {  setPage(page + 1); HandleGetAppointmentsPaginated(page + 1) }}
                onEndReachedThreshold={0.5}
                initialNumToRender={limit}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: width, paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 3, marginBottom: hp(2), }}>
                            <View style={{ width: wp(95), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={{ uri: generateFilePath(item?.doctor?.image) }}
                                        style={{ height: wp(15), width: wp(15) }} />
                                    <View style={{ marginLeft: wp(2), height: wp(15), justifyContent: 'center' }}>
                                        <Text style={{ color: 'black', fontSize: hp(1.6), fontFamily: mainFont }}>{item?.doctor?.name}</Text>
                                        <Text style={{ color: '#7E7B7B', fontSize: hp(1.3), fontFamily: mainFont }}>{item?.doctor?.specialization}</Text>
                                        <Text style={{ color: '#7E7B7B', fontSize: hp(1.3), fontFamily: mainFont }}>Fee : ₹{item?.doctor?.serviceCharge}/-</Text>
                                    </View>
                                </View>

                                <View style={{ width: wp(22), backgroundColor: item.status == "completed" ? "rgba(52, 235, 113, 0.2)" : '#E9AC111F', height: hp(4), borderRadius: 5, marginTop: hp(3), alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: hp(1.7), color: item.status == "completed" ? "green" : '#DB9E00', fontFamily: mainFont, textTransform: "capitalize" }}>{item?.status}</Text>
                                </View>
                            </View>
                            {/* 
                            :
                            Payment Status:
                            Price:
                            Request Date: */}
                            <View style={{ width: width, flexDirection: 'row' }}>
                                <View style={{ width: wp(45), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require('../../assets/images/icn5.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), height: 40, color: 'black', fontFamily: mainFont }}>Patient Name:</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/icn3.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Service Booked:</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/icn5.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Age:</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/MP.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Price:</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1), height: 40 }}>
                                        <Image source={require('../../assets/images/Age.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Request Date:</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/Date.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Payment Status:</Text>
                                    </View>
                                </View>


                                <View style={{ width: wp(50), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), height: 40, color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.patientName}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item.mode == "Offline" ? "Clinic visit" : "Video Call"}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.age}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.appointmentCharge}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1), height: 40 }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}> <Text style={{ color: 'gray' }}>{moment(item?.dateTime).format("YYYY-MM-DD")} ({item?.selectedTimeSlot})</Text></Text>
                                    </View>
                                    {/* 
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item.paymentMode}</Text></Text>
                                    </View> */}
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item.paymentStatus}</Text></Text>
                                    </View>
                                </View>

                            </View>
                            <View style={{ width: wp(90), alignSelf: 'center', alignItems: "center", marginTop: hp(2), flexWrap: "wrap", flexDirection: 'row', justifyContent: 'space-between' }}>
                                {
                                    ((userObj?.role == Roles.DOCTOR) || (userObj?.role == Roles.PATIENT && item.status !== appointmentStatus.PENDING) || (userObj?.role == Roles.FRANCHISE || item.status !== appointmentStatus.PENDING)) && item.mode == consultationMode.ONLINE &&
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('AppointHistory', { data: item })}
                                        style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>History</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    ((userObj?.role == Roles.DOCTOR) || (userObj?.role == Roles.PATIENT && item.status !== appointmentStatus.PENDING) || (userObj?.role == Roles.FRANCHISE || item.status !== appointmentStatus.PENDING)) && item.mode == consultationMode.ONLINE &&
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Chat', { data: item })}
                                        style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Chat</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    item.status == appointmentStatus.COMPLETED && item.mode == consultationMode.ONLINE &&
                                    <TouchableOpacity onPress={() => handleDownloadPrescription(item._id)} style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Prescription</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    userObj?.role == Roles.DOCTOR && item.status == appointmentStatus.PENDING &&
                                    <TouchableOpacity onPress={() => handlechangeAppointmentStatus(item._id, appointmentStatus.CONFIRMED)} style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, alignSelf: "center", height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Accept</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    userObj?.role == Roles.DOCTOR && (item.status == appointmentStatus.CONFIRMED || item.status == appointmentStatus.FOLLOWUP) && item.mode == consultationMode.ONLINE && (item.callInprogress ?
                                        <TouchableOpacity onPress={() => { setSelectedMeeting(item); handleJoinMeeting(item._id, true); }} style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, alignSelf: "center", height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Call in progress</Text>
                                        </TouchableOpacity>
                                        :
                                        <>
                                            {
                                                userObj?.role == Roles.DOCTOR &&
                                                <TouchableOpacity onPress={() => { setSelectedMeeting(item); handleJoinMeeting(item._id, true); }} style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, alignSelf: "center", height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>{userObj?.role == Roles.DOCTOR ? "Start Call" : "Join Call"}</Text>
                                                </TouchableOpacity>
                                            }
                                        </>
                                    )
                                }
                                {
                                    userObj?.role == Roles.DOCTOR && (item.status == appointmentStatus.CONFIRMED || item.status == appointmentStatus.FOLLOWUP) &&
                                    <TouchableOpacity onPress={() => { handleJoinMeeting(item._id, false); }} style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, alignSelf: "center", height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Complete</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    userObj?.role == Roles.PATIENT && (item.status == appointmentStatus.COMPLETED) && item.mode == consultationMode.ONLINE &&
                                    <TouchableOpacity onPress={() => { setComplaintModal(true); setSelectedAppointmentId(item?._id) }} style={{ flex: 1, minWidth: wp(41), marginRight: 10, marginTop: 15, alignSelf: "center", height: hp(5), backgroundColor: 'red', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Raise Issue</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    )
                }}
            />



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
                            setFromDate(day.dateString);
                            setDateModal(false)
                        }}
                    // minDate={`${new Date()}`}
                    />
                </View>
            </Modal>


            <Modal
                isVisible={dateToModal}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackButtonPress={() => setDateToModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setDateToModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>
                    <Calendar
                        onDayPress={day => {
                            settoDate(day.dateString);
                            setDateToModal(false)
                        }}
                        minDate={fromDate && fromDate != "" ? `${new Date(fromDate)}` : `${new Date()}`}
                    />
                </View>
            </Modal>



            <Modal
                isVisible={complaintModal}
                animationIn={'bounceIn'}
                animationOut={'slideOutDown'}
                onBackButtonPress={() => setComplaintModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setComplaintModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: 'black', fontFamily: mainFont, fontWeight: "bold" }}>Raise an issue</Text>

                    <TextInput placeholder='Title' style={{ marginTop: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e) => setTitle(e)} value={title} placeholderTextColor="gray" />
                    <TextInput placeholder='Message' style={{ marginVertical: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e) => setDetails(e)} value={details} multiline placeholderTextColor="gray" />
                    <TouchableOpacity onPress={() => handleAddComplaint()} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Raise an issue / complaint</Text>
                    </TouchableOpacity>
                </View>
            </Modal>



            <Modal
                isVisible={meetingConfirmation}
                animationIn={'zoomIn'}
                animationOut={'zoomOut'}
                onBackButtonPress={() => setMeetingConfirmation(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), height: hp(70), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, }}>
                    <View style={{ height: hp(6), width: wp(85), backgroundColor: maincolor, borderTopRightRadius: 5, borderTopLeftRadius: 5, justifyContent: 'center', paddingLeft: wp(5) }}>
                        <Text style={{ color: 'white', fontSize: hp(1.8), }}>CONSENT FORM FOR TELECOMMUNICATION </Text>
                        <Text style={{ color: 'white', fontSize: hp(1.8), }}>दूरसंचार के लिए सहमति </Text>
                    </View>
                    <ScrollView contentContainerStyle={{ marginTop: 15, width: wp(75), alignSelf: 'center', paddingBottom: 25 }}>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- जांच कराने के लिए दूर-दराज के ओपीडी डॉक्टर के पास जाने के लिए विकल्प नहीं है। इस ओपीडी के पीछे मुख्य विचार दूर-दराज के इलाकों में जहां डॉक्टर की उपलब्धता कम है, मरीज़ों को योग्य डॉक्टरों की आसानी से उपलब्धता कराना है ताकि मरीज़ उनके लक्षणों को नज़रअंदाज़ न करें और गंभीर बीमारियों की चपेट में जल्दी आ जाएं।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- ⁠सभी परामर्श एमसीआई में पंजीकृत डाक्टरों द्वारा ही दिये जाएँगे। रोगी की बीमारी के कारण किसी भी अप्रिय घटना के लिए फीवर 99 जिम्मेदार नहीं होगा।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- ⁠दूर रहने वाले और चलने-फिरने में असमर्थ मरीज़ भी एक ओपीडी के माध्यम से अपना फ़ॉलोअप या रिपोर्ट जाँच करा सकते हैं।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- ⁠स्वास्थ्य कार्यकर्ता या आर.एम.पी की उपस्थिति में ही विशेषज्ञ और सुपर विशेषज्ञ परामर्श दिया जाएगा।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- ⁠यदि परामर्श के बाद भी स्वास्थ्य एवं रोग में कोई सुधार न हो तो तुरंत नज़दीकी अस्पताल में जाकर चिकित्सा की सलाह लें।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- डॉक्टर अपनी समझ या बताई गई समस्याओं के अनुसार आपको सलाह देगा, लेकिन कई लक्षण बिना आत्म-जांच के छूट सकते हैं, ऐसी स्थिति में सुझाव देने वाले डॉक्टर को दोषी नहीं ठहराया जा सकता है।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- काउंटर पर मिलने वाली दवाओं के लिये ही प्रिसक्रिप्शन दिया जाएगा।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- ⁠यह सलाह किसी भी चिकित्सकीय क़ानूनी अद्देश्यों के लिए मान्य नहीं है।</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>- यह सुविधा आपातकालीन स्थितियों के लिए नहीं है, किसी भी आपातकालीन सेवा के लिए तुरंत नज़दीकी डॉक्टर से संपर्क करें !!</Text>


                        <View style={{ flexDirection: 'row', marginTop: hp(2), alignSelf: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => setMeetingConfirmation(false)}
                                style={{ width: wp(25), height: hp(5), backgroundColor: '#BD2626', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', }}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleJoinMeeting(selectedMeeting._id, true)} style={{ width: wp(25), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', }}>I Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

export default Appointment