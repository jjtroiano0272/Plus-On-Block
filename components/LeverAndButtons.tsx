import { buttonIcons } from "@/helpers/common";
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = 150; // Adjust the wheel size
const IMAGE_SIZE = 40; // Size of the arrow image

const directions = [
  { name: "8", angle: 0 },
  { name: "9", angle: 45 },
  { name: "6", angle: 90 },
  { name: "3", angle: 135 },
  { name: "2", angle: 180 },
  { name: "1", angle: 225 },
  { name: "4", angle: 270 },
  { name: "7", angle: 315 },
];

const LeverAndButtons = () => {
  const [selectedDirection, setSelectedDirection] = useState({
    name: "1",
    angle: 225,
  });

  return (
    <View style={styles.container}>
      {/* =====================================================================================
      === Wheel =============================================
      ========================================================================================= */}
      <View style={styles.wheel}>
        {directions.map((dir, index) => {
          const angle = (dir.angle * Math.PI) / 180; // Convert angle to radians
          const x = (WHEEL_SIZE / 2 - IMAGE_SIZE / 2) * Math.cos(angle);
          const y = (WHEEL_SIZE / 2 - IMAGE_SIZE / 2) * Math.sin(angle);

          return (
            <Pressable key={index} onPress={() => setSelectedDirection(dir)}>
              <Image
                source={require("@/assets/images/arrow.png")}
                style={[
                  styles.arrow,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y },
                      { rotate: `${dir.angle}deg` },
                    ],
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>

      {/* =====================================================================================
=== Buttons =============================================
========================================================================================= */}
      <View
        style={[
          {
            paddingHorizontal: 40,
            flexWrap: "wrap",
            flexDirection: "row",

            width: "100%",
            // flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 45,
            height: 100,
          },
        ]}
      >
        {buttonIcons.slice(0, 6).map((button, index) => (
          <Pressable
            key={index}
            style={{
              height: 30,
              width: "33%",
            }}
            onPress={() => {
              Alert.alert(`${button.move} pressed!`);
            }}
          >
            <Image
              source={button?.image}
              style={{ height: "100%", resizeMode: "contain" }}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row",
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    // borderRadius: WHEEL_SIZE / 2,
    // borderWidth: 2,
    // borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: IMAGE_SIZE * 2,
    height: IMAGE_SIZE * 1.5,
    position: "absolute",
    opacity: 0.6,
  },
});

export default LeverAndButtons;
