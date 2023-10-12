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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";

const Profile = ({ navigation }) => {
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [objectId, setObjectId] = useState("");
    const [showPassword, setShowPassword] = React.useState(false)

    const [userData, setUserData] = useState({});

    useEffect(() => {
        
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
                    Profile
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
                {/* Email */}
                <View style={{
                    marginTop: SIZES.padding * 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Add this line
                }}>
                    <Text style={{
                        ...FONTS.h2,
                        color: COLORS.black,
                        marginRight: 10
                    }}>
                        {`${userData.firstName} ${userData.lastName}`}
                    </Text>
                    <Image
                        source={images.avatar}
                        style={{
                            width: 80,
                            height: 80,
                            
                        }}
                    />
                </View>

                {/* Username */}
                <View style={{ marginTop: SIZES.padding * 4 }}>
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
                        placeholder="Username"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={userData.email}
                        editable={false}

                    />
                </View>

                {/* Username */}
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
                        placeholder="Username"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={`${userData.firstName}_${userData.lastName}`.toLowerCase()}
                        editable={false}

                    />
                </View>

                {/* Password */}
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
                        placeholder="Password"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.white}
                        value={userData.password}
                        secureTextEntry={!showPassword}
                        editable={false}
                    />
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: 0,
                            bottom: 15,
                            height: 30,
                            width: 30,
                        }}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Image
                            source={showPassword ? icons.disable_eye : icons.eye}
                            style={{
                                height: 20,
                                width: 20,
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
                        backgroundColor: COLORS.lightblue,
                        borderRadius: SIZES.radius / 1.5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        // Here, navigate to the "Login" screen
                        navigation.navigate("Login");
                    }}
                >
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Logout</Text>
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

export default Profile;
