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
import { COLORS, SIZES, FONTS, icons, images } from "../constants";

const Success = ({ navigation, route }) => {

    const scannedData = route.params?.scannedData || "";
    const reference = route.params?.reference || "";

    const renderHeader = () => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: SIZES.padding * 6,
                    paddingHorizontal: SIZES.padding * 2,
                }}

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
                    Success
                </Text>
            </TouchableOpacity>
        );
    };

    const renderForm = () => {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Image
                    source={images.check}
                    style={{
                        width: 100,
                        height: 100,
                        marginTop: 200, // Add a 20 unit margin at the top
                    }}
                />
                <Text style={{ color: COLORS.lightblue, fontSize: 25, fontWeight: 'bold',marginTop: 20,marginBottom: 20, }}>
                    Transfer Successful!
                </Text>

                <Text style={{ color: COLORS.gray, fontSize: 16 }}>Transaction Reference </Text>
                <Text style={{ color: COLORS.black, fontSize: 12 ,marginTop: 4}}>{reference}</Text>
            </View>

        );
    };

    const renderButton = () => {
        return (
            <View style={{ margin: SIZES.padding * 3, marginTop: SIZES.padding * 22 }}>
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
                        navigation.navigate("Booking", { scannedData });

                    }}
                >
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>OK</Text>
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
        </KeyboardAvoidingView>

    );
};

export default Success;
