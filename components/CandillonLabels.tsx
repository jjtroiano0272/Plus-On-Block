import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

interface LabelProps {
  x: Animated.SharedValue<number>;
  count: number;
  size: number;
}

const CandillonLabels = ({ count, x, size }: LabelProps) => {
  const index = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    index.value = Math.round(x.value / size) + 1;
    return {};
  });

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {new Array(count).fill(0).map((_, i) => {
        const color = interpolateColor(
          index.value <= i ? 0 : 1,
          [0, 1],
          ["gray", "white"]
        );
        return (
          <View key={i} style={{ flex: 1 }}>
            <Animated.Text style={{ color, textAlign: "center", fontSize: 24 }}>
              {`${i + 1}`}
            </Animated.Text>
          </View>
        );
      })}
    </View>
  );
};

export default CandillonLabels;
