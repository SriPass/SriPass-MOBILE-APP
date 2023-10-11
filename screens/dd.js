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

import { LinearGradient } from "expo-linear-gradient";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS, SIZES, FONTS, icons } from "../constants";

const Booking = ({ navigation, route }) => {
    const scannedData = route.params?.scannedData || "";

    const [selectedRoute, setSelectedRoute] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [isRouteValid, setRouteValid] = useState(false);
    const [isDestinationValid, setDestinationValid] = useState(false);
    const [isDateValid, setDateValid] = useState(false);
    const [isTimeValid, setTimeValid] = useState(false);

    const isButtonEnabled = isRouteValid && isDestinationValid && isDateValid && isTimeValid;

    const [destinations, setDestinations] = useState([]);
    const [fare, setFare] = useState("");

    useEffect(() => {
        if (scannedData) {
            // Make a request to your server to fetch destinations for the selected RouteNo
            fetch(`https://sripass.onrender.com/api/busroutes/destinations/${scannedData}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.length > 0) {
                        const destinationOptions = data.map((item) => ({
                            label: `${item.startPoint} - ${item.endPoint}`,
                            value: `${item.startPoint} - ${item.endPoint}`,
                            fare: `LKR ${item.fare}`
                        }));
                        setDestinations(destinationOptions);

                        if (selectedDestination) {
                            const selectedFare = destinationOptions.find((option) => option.value === selectedDestination)?.fare;
                            setFare(selectedFare ? selectedFare.toString() : "");
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching destinations:', error);
                });
        }
    }, [scannedData, selectedDestination]);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const showTimePicker = () => {
        setTimePickerVisible(true);
    };

    const handleDateConfirm = (date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setSelectedDate(formattedDate);
        setDatePickerVisible(false);
        setDateValid(true); // Date is valid
    };

    const handleTimeConfirm = (time) => {
        const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setSelectedTime(formattedTime);
        setTimePickerVisible(false);
        setTimeValid(true); // Time is valid
    };

    const handleRouteChange = (value) => {
        setSelectedRoute(value);
        setRouteValid(!!value); // Validate that a route is selected
    };

    const handleDestinationChange = (value) => {
        setSelectedDestination(value);
        setDestinationValid(!!value); // Validate that a destination is selected

        const selectedFare = destinations.find((option) => option.value === value)?.fare;
        setFare(selectedFare ? selectedFare.toString() : "");
    };

    const renderHeader = () => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: SIZES.padding * 6,
                    paddingHorizontal: SIZES.padding * 2,
                }}
                onPress={() => navigation.navigate("Home")}
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
                    Book Journey
                </Text>
            </TouchableOpacity>
        );
    };

    const renderForm = () => {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 2,
                    marginHorizontal: SIZES.padding * 3,
                }}
            >
                <View
                    style={{
                        marginTop: SIZES.padding * 3,
                        height: 55,
                        backgroundColor: COLORS.lightGray,
                        borderRadius: 10,
                        borderColor: COLORS.gray,
                        borderWidth: 1,
                        paddingLeft: 10,
                        paddingRight: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ ...FONTS.body3, color: scannedData ? COLORS.black : COLORS.gray }}>
                        {scannedData ? `Route ${scannedData}` : "Please Scan QR"}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Scan")} style={{ position: "absolute", right: 10 }}>
                        <Image
                            source={icons.qr}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.gray,
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                <RNPickerSelect
                        items={destinations}
                        onValueChange={(value) => setSelectedDestination(value)}
                        value={selectedDestination}
                        placeholder={{ label: "Select Destination", value: null }}
                        style={{
                            inputIOS: {
                                height: 55,
                                backgroundColor: COLORS.lightGray,
                                color: COLORS.black,
                                borderRadius: 10,
                                borderColor: COLORS.gray,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 40,
                                ...FONTS.body3,
                            },
                            inputAndroid: {
                                height: 55,
                                backgroundColor: COLORS.lightGray,
                                color: COLORS.black,
                                borderRadius: 10,
                                borderColor: COLORS.gray,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 40,
                                ...FONTS.body3,
                            },
                        }}
                    />
                    {!isDestinationValid && (
                        <Text style={{ color: 'red' }}>Please select a destination</Text>
                    )}
                </View>

                <View style={{ marginTop: SIZES.padding * 2 }}>
                    <TextInput
                        style={{
                            marginVertical: SIZES.padding,
                            borderRadius: 10,
                            borderColor: COLORS.gray,
                            borderWidth: 1,
                            height: 55,
                            backgroundColor: COLORS.lightGray,
                            color: COLORS.black,
                            paddingLeft: 10,
                            paddingRight: 10,
                            ...FONTS.body3,
                        }}
                        placeholder="Price"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={fare}
                        editable={false}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 1, flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        style={{
                            flex: 1,
                            marginVertical: SIZES.padding,
                            borderRadius: 10,
                            borderColor: COLORS.gray,
                            borderWidth: 1,
                            height: 55,
                            backgroundColor: COLORS.lightGray,
                            color: COLORS.black,
                            paddingLeft: 10,
                            paddingRight: 40,
                            ...FONTS.body3,
                        }}
                        placeholder="Date"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={selectedDate}
                        onTouchStart={showDatePicker}
                    />
                    <TouchableOpacity onPress={showDatePicker} style={{ position: "absolute", right: 10 }}>
                        <Image
                            source={icons.calendar}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.gray,
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: SIZES.padding * 1, flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        style={{
                            flex: 1,
                            marginVertical: SIZES.padding,
                            borderRadius: 10,
                            borderColor: COLORS.gray,
                            borderWidth: 1,
                            height: 55,
                            backgroundColor: COLORS.lightGray,
                            color: COLORS.black,
                            paddingLeft: 10,
                            paddingRight: 40,
                            ...FONTS.body3,
                        }}
                        placeholder="Time"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={selectedTime}
                        onTouchStart={showTimePicker}
                    />
                    <TouchableOpacity onPress={showTimePicker} style={{ position: "absolute", right: 10 }}>
                        <Image
                            source={icons.clock}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.gray,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderButton = () => {
        return (
            <View style={{ margin: SIZES.padding * 3 }}>
                <TouchableOpacity
                    style={{
                        height: 60,
                        backgroundColor: isButtonEnabled ? COLORS.lightblue : COLORS.gray,
                        borderRadius: SIZES.radius / 1.5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => navigation.navigate("Payment")}
                    disabled={!isButtonEnabled}
                >
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Book Now</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <LinearGradient colors={[COLORS.white, COLORS.white]} style={{ flex: 1 }}>
                <ScrollView>
                    {renderHeader()}
                    {renderForm()}
                    {renderButton()}
                </ScrollView>
            </LinearGradient>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisible(false)}
            />
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setTimePickerVisible(false)}
            />
        </KeyboardAvoidingView>
    );
};

export default Booking;
