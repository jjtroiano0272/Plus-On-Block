import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";
// import MaskedView from "@react-native-com
import MaskedView from "@react-native-masked-view/masked-view";

import GestureHandler from "./GestureHandler";
import { VISIBLE_ITEMS, ITEM_HEIGHT } from "./Constants";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    width: 0.61 * width,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontFamily: "SFProText-Semibold",
    fontSize: 24,
    lineHeight: ITEM_HEIGHT,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
const perspective = 600;
const RADIUS_REL = VISIBLE_ITEMS * 0.5;
const RADIUS = RADIUS_REL * ITEM_HEIGHT;

interface PickerProps {
  defaultValue: number;
  values: { value: number; label: string }[];
}

const Picker = ({ values, defaultValue }: PickerProps) => {
  const translateY = useSharedValue(-ITEM_HEIGHT * defaultValue);

  const maskElement = (
    <Animated.View
      style={useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
      }))}
    >
      {values.map((v, i) => {
        const y = interpolate(
          translateY.value,
          [
            -ITEM_HEIGHT * (i + RADIUS_REL),
            -ITEM_HEIGHT * i,
            -ITEM_HEIGHT * (i - RADIUS_REL),
          ],
          [-1, 0, 1],
          Extrapolation.CLAMP
        );

        const rotateX = Math.asin(y);
        const z = Math.cos(rotateX) * RADIUS - RADIUS;

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { perspective },
            { rotateX: `${rotateX}rad` },
            { translateZ: z },
          ],
        }));

        return (
          <Animated.View key={v.value} style={[styles.item, animatedStyle]}>
            <Text style={styles.label}>{v.label}</Text>
          </Animated.View>
        );
      })}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <MaskedView maskElement={maskElement}>
        <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: "grey" }} />
        <View style={{ height: ITEM_HEIGHT, backgroundColor: "white" }} />
        <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: "grey" }} />
      </MaskedView>
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            borderColor: "grey",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
          }}
        />
      </View>
      <GestureHandler
        max={values.length}
        value={translateY}
        defaultValue={defaultValue}
      />
    </View>
  );
};

export default Picker;
