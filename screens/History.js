import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES, FONTS, icons } from "../constants";

const History = ({ navigation }) => {
  const [passengerId, setPassengerId] = useState("");
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // Fetch the user's name from AsyncStorage when the component mounts
    const fetchPassengerId = async () => {
      try {
        const passengerId = await AsyncStorage.getItem("passengerId");
        if (passengerId) {
          setPassengerId(passengerId);
          fetchHistoryData(passengerId);
        }
      } catch (error) {
        console.error("Error fetching user passengerId:", error);
      }
    };

    const fetchHistoryData = async (passengerId) => {
      try {
        const response = await fetch(
          `https://sripass.onrender.com/api/travelhistory/id/${passengerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistoryData(data);
        } else {
          console.error("Error fetching history data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchPassengerId();
  }, []);

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
        <Text
          style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.black, ...FONTS.h4 }}
        >
          Travel History
        </Text>
      </TouchableOpacity>
    );
  };

  const renderForm = () => {
    // Check if historyData is defined and not empty
    if (!historyData || historyData.length === 0) {
      return (
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: COLORS.black }}>No history data available.</Text>
        </View>
      );
    }

    return (
      <View
        style={{
          marginTop: SIZES.padding * 3,
          marginHorizontal: SIZES.padding * 3,
        }}
      >
        {historyData.map((item, index) => (
          <View key={index}>
            <Text style={{ color: COLORS.black }}>RouteNo: {item.RouteNo}</Text>
            <Text style={{ color: COLORS.black }}>Cost: {item.cost}</Text>
          </View>
        ))}
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
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default History;
