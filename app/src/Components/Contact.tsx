import { useNavigation } from "@react-navigation/native"
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Headerr from '../ReuseableComp/Headerr'

export default function Contactus() {
    const navigate = useNavigation()

    const handleRedirectToWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${9876543215}&text=''`);
    }

    const handleRedirectToPhone = () => {
        Linking.openURL(`tel:${9876543215}`)
    }

    const handleRedirectToEmail = () => {
        Linking.openURL(`mailto:support@fever99.com`)
    }

    const handleRedirectToYoutube = () => {
        Linking.openURL("https://www.youtube.com/embed/_xjIgqE05ik?si=6dhJb2F7y_beEa84");
    }

    const handleRedirectToTwitter = () => {
        // Linking.canOpenURL("twitter://timeline").then(supported => {
        //     if (!supported) {
        //         Alert.alert("You do not have twitter on your phone",
        //             "",
        //             [
        //                 { text: "go to store", onPress: () => Linking.openURL("market://details?id=com.twitter.com") },
        //                 { text: "cancel", onPress: () => { }, style: 'cancel' },
        //             ],
        //             { cancelable: false }
        //         );
        //     } else {
        //         return Linking.openURL("twitter://timeline");
        //     }
        // }).catch(err => {
        //     console.error(err);
        // });
        return Linking.openURL("https://twitter.com/");
        // Linking.openURL('twitter://timeline')
    }


    return (
        <>
            <Headerr secndheader label={'Contact Us'} />
            <ScrollView style={[{ backgroundColor: "white" }]}>
                <Pressable>
                    <Image source={require('../../assets/images/contact_us.png')} style={internalcss.imgfluid} resizeMode='contain' />
                </Pressable>
                <Text style={internalcss.gettext}>Get in Touch with us</Text>
                <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

                    <Pressable style={{ marginTop: 10, minHeight: hp(7), maxWidth: wp(32), minWidth: wp(30), display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} onPress={() => handleRedirectToPhone()} >
                        <Feather name='phone-call' size={20} color='#050845' />
                        <Text style={internalcss.textStyle}>Phone</Text>

                    </Pressable>
                    <Pressable style={{ marginTop: 10, minHeight: hp(7), maxWidth: wp(32), minWidth: wp(30), display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} onPress={() => handleRedirectToWhatsapp()} >
                        <FontAwesome name='whatsapp' size={20} color='#050845' />
                        <Text style={internalcss.textStyle}>Whatsapp</Text>
                    </Pressable>
                    <Pressable style={{ marginTop: 10, minHeight: hp(7), maxWidth: wp(32), minWidth: wp(30), display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} onPress={() => handleRedirectToEmail()} >
                        <FontAwesome name='envelope-o' size={20} color='#050845' />
                        <Text style={internalcss.textStyle}>Email</Text>
                    </Pressable>
                    <Pressable style={{ marginTop: 10, minHeight: hp(7), maxWidth: wp(32), minWidth: wp(30), display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} onPress={() => handleRedirectToYoutube()} >
                        <SimpleLineIcons name='social-youtube' size={20} color='#050845' />
                        <Text style={internalcss.textStyle}>Youtube</Text>
                    </Pressable>
                    <Pressable style={{ marginTop: 10, minHeight: hp(7), maxWidth: wp(32), minWidth: wp(30), display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} onPress={() => handleRedirectToTwitter()} >
                        <Feather name='twitter' size={20} color='#050845' />
                        <Text style={internalcss.textStyle}>Twitter</Text>
                    </Pressable>
                </View>
                <Pressable onPress={() => handleRedirectToWhatsapp()} style={internalcss.boxinfo}>
                    <Ionicons name='location-outline' size={25} color='#050845' />
                    <Text style={internalcss.numver}>Fever99 E-clinic, Shriram Complex, Near SPR Society, Sector 82, Faridabad, Haryana</Text>
                </Pressable>

            </ScrollView>
        </>
    )
}

const internalcss = StyleSheet.create({
    numver: {
        color: '#050845',
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        width: wp(80)
    },
    textStyle: {
        color: '#050845',
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        marginTop: 10
    },
    boxinfo: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        shadowColor: "#aaa",
        marginHorizontal: 2,
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    gettext: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        textAlign: 'center',
        color: '#050845',
        paddingVertical: 15,
    },
    imgfluid: {
        width: '100%',
        height: 220,
        marginTop: 40
    }
})