import React, { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ArrowBendUpLeft, X, DownloadSimple } from "phosphor-react-native";

const screenHeight = Dimensions.get("window").height;

export default function DetaliiSimbol({ simbol, onClose }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
  console.log("SIMBOL MODAL:", simbol);
    if (simbol) {
      if (simbol?.uri) {
        Image.prefetch(simbol.uri).catch(err => console.log("Image preload error:", err));
      }
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [simbol]);

  const handleClose = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={!!simbol}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            {/* <Ionicons name="close" size={36} color="#4c1f1f" /> */}
            <X size={36} color="#4c1f1f" weight="light" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: simbol?.uri }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{simbol?.nume}</Text>

            {simbol?.semnificatie && (
              <Text style={styles.modalDescription}>
                Semnificație: {simbol.semnificatie}
              </Text>
            )}
            {simbol?.descriere && (
              <Text style={styles.modalDescription}>
                Descriere: {simbol.descriere}
              </Text>
            )}
            {simbol?.regiuni && (
              <Text style={styles.modalDescription}>
                Regiuni: {simbol.regiuni}
              </Text>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "#f5e9d6",
    borderRadius: 16,
    width: "90%",
    maxHeight: screenHeight * 0.8,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "#4c1f1f",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 0,
  },
  modalImage: {
    width: "80%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4c1f1f",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "DancingScript_400Regular",
  },
  modalDescription: {
    fontSize: 17,
    color: "#4c1f1f",
    marginTop: 18,
    textAlign: "justify",
    lineHeight: 22,
    fontFamily: "Spectral_300Light_Italic",
  },
  modalScrollContent: {
    paddingTop: 40,
    paddingBottom: 30,
  },
});
