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

import { COLORS, SIZES, FONTS, icons, images } from "../constants";

const Booking = ({ navigation, route }) => {



    const scannedData = route.params?.scannedData || "";

    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [priceInput, setPriceInput] = useState('');
    const [routeNumbers, setRouteNumbers] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('');

    const [destinations, setDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState('');
    const [fare, setFare] = useState('');



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
                            fare: item.fare // Include the fare in the destination options
                        }));
                        setDestinations(destinationOptions);

                        // Set the fare and selectedDestination if there's a selected destination
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
    }, [scannedData, selectedDestination]); // Include selectedDestination as a dependency



    useEffect(() => {
        fetch('https://sripass.onrender.com/api/busroutes/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.length > 0) {
                    // Assuming each data item has a "RouteNo" field
                    const routeNumbers = data.map((item) => item.RouteNo);
                    setRouteNumbers(routeNumbers);
                    setSelectedRoute(routeNumbers[0]);
                }
            })
            .catch((error) => {
                console.error('Error fetching route numbers:', error);
            });
    }, []);


    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca3,idd")
            .then((response) => response.json())
            .then((data) => {
                let areaData = data.map((item) => {
                    return {
                        code: item.cca3,
                        name: item.name?.common,
                        flag: item.flags.png,
                        callingCode: item.idd?.root + item.idd?.suffixes[0],
                    };
                });
                setAreas(areaData);

                if (areaData.length > 0) {
                    let defaultData = areaData.filter((a) => a.code == "US");

                    if (defaultData.length > 0) {
                        setSelectedArea(defaultData[0]);
                    }
                }
            });
    }, []);

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
    };

    const handleTimeConfirm = (time) => {
        // Format the selected time as needed
        const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Update the selected time state and hide the time picker
        setSelectedTime(formattedTime);
        setTimePickerVisible(false);
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

                {/* Route Dropdown */}
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



                {/* Destination Dropdown */}
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
                </View>

                {/* Price */}
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
                        value={`LKR ${fare}`}
                        editable={false}
                        onChangeText={(value) => setFare(value)} // Add this to handle changes to the Price TextInput

                    />
                </View>



                {/* Date */}
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
                            paddingRight: 40, // Adjust the paddingRight to make space for the icon
                            ...FONTS.body3,
                        }}
                        placeholder="Date"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={selectedDate} // Display the selected date here
                        onTouchStart={showDatePicker} // Open the date picker on press
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


                {/* Time */}
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
                            paddingRight: 40, // Adjust the paddingRight to make space for the icon
                            ...FONTS.body3,
                        }}
                        placeholder="Time"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={selectedTime} // Display the selected time here
                        onTouchStart={showTimePicker} // Open the time picker on press
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
        const isFormIncomplete = !selectedDestination || !selectedDate || !selectedTime || !fare;

        return (
            <View style={{ margin: SIZES.padding * 3 }}>
                <TouchableOpacity
                    style={{
                        height: 60,
                        backgroundColor: isFormIncomplete ? COLORS.gray : COLORS.lightblue,
                        borderRadius: SIZES.radius / 1.5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        if (!isFormIncomplete) {
                            // Pass the 'fare' as a parameter to the Payment page
                            navigation.navigate("Payment", { fare });
                        }
                    }}
                    disabled={isFormIncomplete}
                >
                    <Text style={{ color: isFormIncomplete ? COLORS.white : COLORS.white, ...FONTS.h3 }}>
                        Book Now
                    </Text>
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
