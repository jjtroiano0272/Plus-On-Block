import React from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import CandillonLabels from "./CandillonLabels";
import CandillonCursor from "./CandillonCursor";

const { width: totalWidth } = Dimensions.get("window");
const count = 10;
const width = totalWidth / count;
const height = width;

const CandillonSlider = ({
  additionalStyles,
}: {
  additionalStyles?: ViewStyle;
}) => {
  const x = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(Math.max(x.value, 0) + height * 0.2),
    };
  });

  return (
    <View style={[styles.container, additionalStyles && additionalStyles]}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#bd536d",
            height,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
      <CandillonLabels size={height} {...{ x, count }} />
      <CandillonCursor size={height} {...{ x, count }} />
    </View>
  );
};

export default CandillonSlider;

const styles = StyleSheet.create({
  container: {
    width: totalWidth * 0.8,
    height,
    borderRadius: height / 2,
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
  },
});
