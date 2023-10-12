import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {

    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");

    const [objectId, setObjectId] = useState("");
    

    useEffect(() => {
        // Fetch the user's email from AsyncStorage when the component mounts
        const fetchUserEmail = async () => {
            try {
                const email = await AsyncStorage.getItem("userEmail");
                if (email) {
                    setUserEmail(email);
                }
            } catch (error) {
                console.error("Error fetching user email:", error);
            }
        };

        fetchUserEmail();
    }, []);

    useEffect(() => {
        // Fetch the user's name from AsyncStorage when the component mounts
        const fetchUserName = async () => {
            try {
                const name = await AsyncStorage.getItem("userName");
                if (name) {
                    setUserName(name);
                }
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };

        fetchUserName();
    }, []);
    
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

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', marginVertical: SIZES.padding * 2 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h1 }}>SriPass</Text>
                    <Text style={{ ...FONTS.body2, color: COLORS.gray }}>Welcome, {userName || "{user.name}"}</Text>

                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={{
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            backgroundColor: COLORS.lightGray
                        }}
                    >
                        <Image
                            source={icons.bell}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.secondary
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                height: 10,
                                width: 10,
                                backgroundColor: COLORS.red,
                                borderRadius: 5
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    function renderBanner() {
        return (
            <View
                style={{
                    height: 120,
                    borderRadius: 20,
                }}
            >
                <Image
                    source={images.banner}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 20
                    }}
                />
            </View>
        )
    }

    function renderWallet() {

        const Header = () => (
            <View style={{ marginBottom: SIZES.padding * 2, marginTop: SIZES.padding * 2 }}>
              <Text style={{ ...FONTS.h3,marginBottom: SIZES.padding * 2 }}>Wallet Balance</Text>
          
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  padding: SIZES.padding * 4,
                  shadowColor: COLORS.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4, // This is for Android shadow
                }}
              >
                <Text
                  style={{
                    ...FONTS.h5,
                    fontSize: 50,
                    color: COLORS.black,
                    fontWeight: 'bold',
                  }}
                >
                  LKR {userData.balance}
                </Text>
              </View>
            </View>
          );
          




        return (
            <FlatList
                ListHeaderComponent={Header}
                numColumns={4}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                keyExtractor={item => `${item.id}`}
                style={{ marginTop: SIZES.padding * 2 }}
            />
        )
    }

    function renderHome() {

        const HeaderComponent = () => (
            <View>
                {renderHeader()}
                {renderBanner()}
                {renderWallet()}

            </View>
        )





        return (
            <FlatList
                ListHeaderComponent={HeaderComponent}
                contentContainerStyle={{ paddingHorizontal: SIZES.padding * 3 }}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={{ marginBottom: 80 }}>
                    </View>
                }
            />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            {renderHome()}
        </SafeAreaView>
    )
}

export default Home;