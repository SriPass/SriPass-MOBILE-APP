import React, { useState, useEffect } from "react";
import RNPickerSelect from 'react-native-picker-select';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS, SIZES, FONTS, icons, images } from "../constants";



const Payment = ({ navigation, route }) => {

    const { fare, scannedData, selectedDestination, selectedDate, selectedTime, passengerId } = route.params;


    const [objectId, setObjectId] = useState("");
    const [userData, setUserData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(false);

    useEffect(() => {
        // Fetch the user's email from AsyncStorage when the component mounts
        const fetchObjectId = async () => {
            try {
                const id = await AsyncStorage.getItem("objectId");
                if (id) {
                    setObjectId(id);
                }
            } catch (error) {
                console.error("Error fetching user objectId:", error);
            }
        };

        fetchObjectId();
    }, []);

    useEffect(() => {
        // Disable the button when userData is still loading
        if (userData === undefined || userData.balance === undefined) {
            setIsConfirmButtonDisabled(true);
        } else {
            setIsConfirmButtonDisabled(false);
        }
    }, [userData]);


    useEffect(() => {
        // Fetch user data based on the objectId using another useEffect
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://sripass.onrender.com/api/localpassengers/${objectId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Update the userData state with the fetched data
                    setUserData(data);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (objectId) {
            fetchUserData();
        }
    }, [objectId]);

    const reference = '#REF' + objectId.substring(0, 5) + selectedDate.replace(/-/g, '');

    const updateCost = async () => {
        try {
            const newCost = userData.balance - fare;
            const response = await fetch(`https://sripass.onrender.com/api/localpassengers/${objectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    balance: newCost,
                }),
            });

            if (response.ok) {
                // The cost field has been successfully updated
                console.log("Cost updated successfully");
                // You might want to update the userData state with the new cost here if necessary
                setUserData({ ...userData, cost: newCost });
            } else {
                console.error("Failed to update cost");
            }
        } catch (error) {
            console.error("Error updating cost:", error);
        }
    };

    const saveTravelHistory = async () => {
        try {
            const response = await fetch("https://sripass.onrender.com/api/travelhistory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    PassengerID: passengerId,
                    route: selectedDestination,
                    routeNo: scannedData,
                    date: selectedDate,
                    time: selectedTime,
                    cost: fare,
                }),
            });

            if (response.ok) {
                // Data was successfully saved, navigate to the "Book" page
                navigation.navigate('Success', { reference, scannedData });
            } else {
                console.error("Failed to save travel history");
            }
        } catch (error) {
            console.error("Error saving travel history:", error);
        }
    };


    const handlePayment = () => {
        if (userData && userData.balance !== undefined && userData.balance >= fare) {
            // Sufficient balance, proceed with payment logic here
            // Call the function to save travel history
            saveTravelHistory();
            updateCost();

        } else {
            setErrorMessage("Insufficient balance");
            setIsConfirmButtonDisabled(true);
        }
    };



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <LinearGradient colors={[COLORS.white, COLORS.white]} style={{ flex: 1 }}>
                <ScrollView>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: SIZES.padding * 6,
                            paddingHorizontal: SIZES.padding * 2,
                        }}
                        onPress={() => navigation.navigate('Booking', { scannedData })}
                    >
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.black,
                            }}
                        />
                        <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.black, ...FONTS.h4 }}>
                            Make Payment
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            marginTop: SIZES.padding * 5,
                            marginHorizontal: SIZES.padding * 3,
                        }}
                    >
                        <View style={{ alignItems: "center", paddingBottom: 5 }}>
                            <Text
                                style={{
                                    ...FONTS.h6,
                                    fontSize: 15,
                                    color: COLORS.black,
                                }}
                            >
                                Payment
                            </Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    ...FONTS.h5,
                                    fontSize: 50,
                                    fontWeight: 'bold',
                                    color: COLORS.primary,
                                }}
                            >
                                LKR {fare}
                            </Text>
                        </View>

                    </View>

                    <View style={{ marginTop: SIZES.padding * 5, marginHorizontal: SIZES.padding * 3 }}>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: COLORS.gray,
                                marginVertical: SIZES.padding,
                            }}
                        />

                        {/* Display route and createdAt in the same row */}
                        <View style={{ marginTop: SIZES.padding * 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 18, fontWeight: 'bold', paddingBottom: 6 }}>Wallet Balance</Text>
                            <Text style={{ color: COLORS.black, fontSize: 16, paddingBottom: 2 }}>
                                {userData.balance !== undefined ? `LKR ${userData.balance}` : 'Loading...'}
                            </Text>

                        </View>

                        <View style={{ marginTop: SIZES.padding * 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 16, }}>Route</Text>
                            <Text style={{ color: COLORS.darkgray, fontSize: 16, }}>{selectedDestination}</Text>
                        </View>

                        <View style={{ marginTop: SIZES.padding * 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 16 }}>Route No</Text>
                            <Text style={{ color: COLORS.darkgray, fontSize: 16 }}>{scannedData}</Text>
                        </View>

                        <View style={{ marginTop: SIZES.padding * 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 16 }}>Date</Text>
                            <Text style={{ color: COLORS.darkgray, fontSize: 16 }}>{selectedDate}</Text>
                        </View>

                        <View style={{ marginTop: SIZES.padding * 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 16 }}>Time</Text>
                            <Text style={{ color: COLORS.darkgray, fontSize: 16 }}>{selectedTime}</Text>
                        </View>

                        <View style={{ marginTop: SIZES.padding * 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 16 }}>Cost</Text>
                            <Text style={{ color: COLORS.darkgray, fontSize: 16 }}>LKR {fare}</Text>
                        </View>

                        <View style={{ marginTop: SIZES.padding * 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.black, fontSize: 16 }}>Reference</Text>
                            <Text style={{ color: COLORS.darkgray, fontSize: 16 }}>{reference}</Text>
                        </View>



                    </View>

                    <View style={{ marginTop: SIZES.padding * 10, margin: SIZES.padding * 3 }}>
                        <TouchableOpacity
                            style={{
                                height: 60,
                                backgroundColor: isConfirmButtonDisabled ? COLORS.gray : COLORS.lightblue,
                                borderRadius: SIZES.radius / 1.5,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            disabled={isConfirmButtonDisabled}
                            onPress={handlePayment}
                        >
                            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Confirm Payment</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: SIZES.padding * 2, alignItems: 'center' }}>
                            {errorMessage && (
                                <Text style={{ color: COLORS.red, ...FONTS.body3 }}>{errorMessage}</Text>
                            )}
                        </View>

                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export default Payment;
