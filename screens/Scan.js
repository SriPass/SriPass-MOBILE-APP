import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS, FONTS, SIZES, icons, images } from "../constants";

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

  function onBarCodeRead(result) {
    if (!scanned) {
      setScanned(true);
      console.log(result.data);
      toggleModal(result.data);
      navigation.navigate('Booking', { scannedData: result.data });
    }
  }

  const toggleModal = (data = "") => {
    setScannedData(data);
    setIsModalVisible(!isModalVisible);
  };

  const renderHeader = () => {
    return (
      <View>
        {/* Your header UI components */}
      </View>
    );
  }

  const renderScanFocus = () => {
    return (
      <View>
        {/* Your scan focus UI components */}
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

  const renderModal = () => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          toggleModal();
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20 }}>Route No: {scannedData}</Text>
           
            
          </View>
        </View>
      </Modal>
      
    );
  };

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
      {renderModal()}
    </View>
  );
};

export default Scan;
