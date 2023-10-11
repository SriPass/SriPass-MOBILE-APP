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

function isVisaCardNumberValid(cardNumber) {
    // Remove spaces and non-digit characters
    const cleanedCardNumber = cardNumber.replace(/\D/g, '');

    // Check if the card number is 16 digits
    return cleanedCardNumber.length === 16;
}

const Payment = ({ navigation }) => {
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [cardNumber, setCardNumber] = useState('');
    const [isCardNumberValid, setCardNumberValid] = useState(true);

    const handleCardNumberChange = (text) => {
        setCardNumber(text);
        // Check and update card number validation
        setCardNumberValid(isVisaCardNumberValid(text));
    };

    const [cvv, setCvv] = useState('');
    const [isCvvValid, setCvvValid] = useState(true);

    const handleCvvChange = (text) => {
        setCvv(text);
        // Check and update CVV validation
        setCvvValid(text.length === 3);
    };

    const [cardType, setCardType] = useState('Credit'); // Initial card type

    const handleCardTypeChange = (type) => {
        setCardType(type);
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const handleDateConfirm = (date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setSelectedDate(formattedDate);
        setDatePickerVisible(false);
    };

    const isButtonEnabled = isCardNumberValid && isCvvValid && selectedDate;

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
                            Make Payment
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            marginTop: SIZES.padding * 5,
                            marginHorizontal: SIZES.padding * 3,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ marginRight: 10 }}
                                onPress={() => handleCardTypeChange('Credit')}
                            >
                                <Text style={{ color: cardType === 'Credit' ? COLORS.primary : COLORS.black, fontSize: 18 }}>
                                    Credit
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCardTypeChange('Debit')}>
                                <Text style={{ color: cardType === 'Debit' ? COLORS.primary : COLORS.black, fontSize: 18 }}>
                                    Debit
                                </Text>
                            </TouchableOpacity>
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
                                placeholder="Card Number"
                                placeholderTextColor={COLORS.gray}
                                selectionColor={COLORS.white}
                                onChangeText={handleCardNumberChange}
                                value={cardNumber}
                                keyboardType="number-pad"
                                maxLength={16}
                            />
                            {!isCardNumberValid && (
                                <Text style={{ color: 'red' }}>Invalid card number</Text>
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
                                placeholder="CVV"
                                placeholderTextColor={COLORS.gray}
                                selectionColor={COLORS.white}
                                onChangeText={handleCvvChange}
                                value={cvv}
                                keyboardType="number-pad"
                                maxLength={3}
                            />
                            {!isCvvValid && (
                                <Text style={{ color: 'red' }}>Invalid CVV</Text>
                            )}
                        </View>
                        <View style={{ marginTop: SIZES.padding * 2, flexDirection: "row", alignItems: "center" }}>
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
                                placeholder="Expiry Date"
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
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ margin: SIZES.padding * 3 }}>
                        <TouchableOpacity
                            style={{
                                height: 60,
                                backgroundColor: isButtonEnabled ? COLORS.lightblue : COLORS.gray,
                                borderRadius: SIZES.radius / 1.5,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => navigation.navigate("HomeTabs")}
                            disabled={!isButtonEnabled}
                        >
                            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Confirm Payment</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                display="spinner"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisible(false)}
            />
        </KeyboardAvoidingView>
    );
};

export default Payment;
