import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import { Audio } from 'expo-av';



const Scan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const playScanSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/scan_sound.mp3') // Replace with the path to your audio file
    );

    await sound.playAsync();
  };


  const onBarCodeRead = (result) => {
    if (!scanned) {
      setScanned(true);
      console.log(result.data);
      playScanSound();
      setTimeout(() => {
        navigation.navigate('Booking', { scannedData: result.data });
        // Reset the scanned state after navigating
        //setScanned(false);
      }, 500);
    }
  };



  const toggleModal = (data = "") => {
    setScannedData(data);
    setIsModalVisible(!isModalVisible);
  };

  function renderHeader() {
    return (
      <View style={{ flexDirection: 'row', marginTop: SIZES.padding * 4, paddingHorizontal: SIZES.padding * 3 }}>
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={icons.close}
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white
            }}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Scan for Route</Text>
        </View>

        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            backgroundColor: COLORS.lightblue,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => console.log("Info")}
        >
          <Image
            source={icons.info}
            style={{
              height: 25,
              width: 25,
              tintColor: COLORS.white
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }


  const renderScanFocus = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          source={images.focus}
          resizeMode="stretch"
          style={{
            marginTop: "-55%",
            width: 200,
            height: 200
          }}
        />
      </View>
    );
  }

  const renderPaymentMethods = () => {
    return (
      <View>
        {/* Your payment methods UI components */}
      </View>
    );
  }


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.transparent }}>
      <BarCodeScanner
        onBarCodeScanned={onBarCodeRead}
        style={{ flex: 1 }}
      >
        {renderHeader()}
        {renderScanFocus()}
        {renderPaymentMethods()}
      </BarCodeScanner>
    </View>
  );
};

export default Scan;
