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
      <View style={{ marginTop: SIZES.padding * 5, marginHorizontal: SIZES.padding * 3 }}>
        {historyData.map((item, index) => (
          <View key={index}>
            {/* Display route and createdAt in the same row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: COLORS.black, fontSize: 18, fontWeight: 'bold', paddingBottom: 5 }}>{item.journey}</Text>
              <Text style={{ color: COLORS.gray, fontSize: 16, paddingBottom: 2 }}>{item.createdAt.split('T')[0]}</Text>
            </View>
            
            <Text style={{ color: COLORS.black, fontSize: 16, paddingBottom: 2 }}>Duration: {item.duration} min</Text>
            <Text style={{ color: COLORS.black, fontSize: 16, paddingBottom: 2 }}>Distance: {item.distance} Km</Text>
            <Text style={{ color: COLORS.black, fontSize: 16 }}>Cost: LKR {item.cost}</Text>
    
            {index !== historyData.length - 1 && ( // Add a divider if not the last item
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.gray,
                  marginVertical: SIZES.padding,
                }}
              />
            )}
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
