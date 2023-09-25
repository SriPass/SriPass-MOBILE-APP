import React, { useState, useEffect } from "react";
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

const Booking = ({ navigation }) => {
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);



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
                    marginTop: SIZES.padding * 3,
                    marginHorizontal: SIZES.padding * 3,
                }}
            >
                {/* Route */}
                <View style={{ marginTop: SIZES.padding * 3 }}>
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
                        placeholder="Route"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
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


                {/* No of Seats */}
                <View style={{ marginTop: SIZES.padding * 1 }}>
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
                        placeholder="No of Seats"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                    />
                </View>

                {/* Price */}
                <View style={{ marginTop: SIZES.padding * 1 }}>
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
                    />
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
                        backgroundColor: COLORS.lightblue,
                        borderRadius: SIZES.radius / 1.5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => navigation.navigate("HomeTabs")}
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
