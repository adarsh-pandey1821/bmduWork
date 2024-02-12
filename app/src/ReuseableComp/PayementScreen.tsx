import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CardField, useStripe } from '@stripe/stripe-react-native';
// import { addAmountToWallet, checkPaymentStatus, create_stripe_payment_intent, create_stripe_payment_session, initiateWalletRecharge } from '../Services/wallet.service';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import url, { stipeKey } from '../Services/url.service';
import { getUser } from '../Services/user.service';

export default function PayementScreen(props: any) {
    const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe();
    const [clientSecret, setClientSecret] = useState(null);
    const focused = useIsFocused()
    const [orderId, setOrderId] = useState(new Date().getTime());
    const navigation: any = useNavigation();
    const [userObj, setUserObj] = useState<any>({});
    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData)
        }
    }

    const handleWebViewState = (e: any) => {
        if (`${e?.url}`.includes("https://www.fever99.com/")) {
            navigation.navigate("PayementSuccess")
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetAndSetUser()
        }
    }, [focused])

    return (
        <View>
            <View style={{ height: hp(100), width: wp(100), backgroundColor: "red" }}>
                {
                    userObj?._id &&
                    <WebView
                        source={{
                            uri: `${url}/initiateWalletRecharge/?amount=${props?.route?.params?.amount}&appointmentId=${props?.route?.params?.appointmentId}&userId=${userObj?._id}`,
                        }}
                        onMessage={(event) => {
                            // Handle messages from the WebView, if needed
                            console.log(event.nativeEvent.data);
                        }}
                        onNavigationStateChange={(e) => handleWebViewState(e)}
                        onLoadEnd={() => {
                            // WebView has loaded
                        }}
                    />
                }
            </View>
        </View>
    )
}