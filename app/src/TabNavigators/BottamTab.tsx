import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useState, useEffect } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LoginContext } from '../../App';
import Appointment from '../Components/Appointment';
import Home from '../Components/Home';
import Profile from '../Components/Profile';
import Service from '../Components/Service';
import CategoryStack from '../Stacks/CategoryStack';
import { getUser } from '../Services/user.service';
import { useIsFocused } from '@react-navigation/native';
import Referal from '../Components/Referal';
import { Roles } from '../utils/constant';
import Transactions from '../Components/Transactions';

const Botmtab = createBottomTabNavigator();

const BottamTab = () => {
    const [user, setUser] = useContext(LoginContext)
    const [userObj, setUserObj] = useState<any>({});

    const focused = useIsFocused();
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

    return (
        <Botmtab.Navigator screenOptions={{
            tabBarStyle: { height: hp(7.2) },
            tabBarShowLabel: false,
            headerShown: false,

        }}>

            <Botmtab.Screen name='Home' component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            <View style={{
                                height: 3,
                                backgroundColor: focused ? '#1263AC' : "",
                                width: 80,
                                // justifyContent:'center'
                            }}></View>
                            <Image source={require('../../assets/images/home.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    tintColor: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    marginTop: 5
                                }}
                            />
                            <Text style={{
                                color: focused ? '#1263AC' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center',
                                fontSize: 12
                            }}>
                                Home
                            </Text>
                        </View>
                    )
                }}
            />

            {user == 'PATIENT' && <Botmtab.Screen name='Service' component={Service}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            <View style={{
                                height: 3,
                                backgroundColor: focused ? '#1263AC' : "",
                                width: 80,
                                // justifyContent:'center'
                            }}></View>
                            <Image source={require('../../assets/images/service.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    tintColor: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    marginTop: 5
                                }}
                            />
                            <Text style={{
                                color: focused ? '#1263AC' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center',
                                fontSize: 12
                            }}>
                                History
                            </Text>
                        </View>
                    )
                }}
            />}

            {user == 'PATIENT' && <Botmtab.Screen name='CategoryStack' component={CategoryStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            <View style={{
                                height: 3,
                                backgroundColor: focused ? '#1263AC' : "",
                                width: 80,
                                // justifyContent:'center'
                            }}></View>
                            <Image source={require('../../assets/images/category.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    tintColor: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    marginTop: 5
                                }}
                            />
                            <Text style={{
                                color: focused ? '#1263AC' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center',
                                fontSize: 12
                            }}>
                                Services
                            </Text>
                        </View>
                    )
                }}
            />}

            <Botmtab.Screen name='Appointment' component={Appointment}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            <View style={{
                                height: 3,
                                backgroundColor: focused ? '#1263AC' : "",
                                width: 80,
                                // justifyContent:'center'
                            }}></View>
                            <Image source={require('../../assets/images/appoinment.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    tintColor: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    marginTop: 5
                                }}
                            />
                            <Text style={{
                                color: focused ? '#1263AC' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center',
                                fontSize: 12
                            }}>
                                Appointment
                            </Text>
                        </View>
                    )
                }}
            />
            {
                userObj?.role == Roles.FRANCHISE &&
                <Botmtab.Screen name='Referal' component={Referal}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                height: 60
                            }}>
                                <View style={{
                                    height: 3,
                                    backgroundColor: focused ? '#1263AC' : "",
                                    width: 80,
                                    // justifyContent:'center'
                                }}></View>
                                <Image source={require('../../assets/images/appoinment.png')}
                                    style={{
                                        height: wp(6),
                                        width: wp(6),
                                        tintColor: focused ? '#1263AC' : 'grey',
                                        alignSelf: 'center',
                                        marginTop: 5
                                    }}
                                />
                                <Text style={{
                                    color: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    fontSize: 12
                                }}>
                                    Referal
                                </Text>
                            </View>
                        )
                    }}
                />
            }
            {
                userObj?.role == Roles.FRANCHISE &&
                <Botmtab.Screen name='Transaction' component={Transactions}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                height: 60
                            }}>
                                <View style={{
                                    height: 3,
                                    backgroundColor: focused ? '#1263AC' : "",
                                    width: 80,
                                    // justifyContent:'center'
                                }}></View>
                                <Image source={require('../../assets/images/appoinment.png')}
                                    style={{
                                        height: wp(6),
                                        width: wp(6),
                                        tintColor: focused ? '#1263AC' : 'grey',
                                        alignSelf: 'center',
                                        marginTop: 5
                                    }}
                                />
                                <Text style={{
                                    color: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    fontSize: 12
                                }}>
                                    Transaction
                                </Text>
                            </View>
                        )
                    }}
                />
            }

            <Botmtab.Screen name='Profile' component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            <View style={{
                                height: 3,
                                backgroundColor: focused ? '#1263AC' : "",
                                width: 80,
                                // justifyContent:'center'
                            }}></View>
                            <Image source={require('../../assets/images/profile.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    tintColor: focused ? '#1263AC' : 'grey',
                                    alignSelf: 'center',
                                    marginTop: 5
                                }}
                            />
                            <Text style={{
                                color: focused ? '#1263AC' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center',
                                fontSize: 12
                            }}>
                                Profile
                            </Text>
                        </View>
                    )
                }}
            />

        </Botmtab.Navigator>
    )
}

export default BottamTab