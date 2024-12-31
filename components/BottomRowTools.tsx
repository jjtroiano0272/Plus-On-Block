import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MyIconButton from "./MyIconButton";

const BottomRowTools = () => {
  return (
    <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
      <MyIconButton
        androidName="library"
        iosName="photo.stack"
        onPress={() => {}}
      />
    </View>
  );
};

export default BottomRowTools;

const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
});
