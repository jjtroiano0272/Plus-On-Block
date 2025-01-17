import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withDecay,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import { ITEM_HEIGHT } from "./Constants";

interface GestureHandlerProps {
  value: Animated.SharedValue<number>;
  max: number;
  defaultValue: number;
}

const GestureHandler = ({ value, max, defaultValue }: GestureHandlerProps) => {
  const offset = useSharedValue(-ITEM_HEIGHT * defaultValue);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = offset.value;
    },
    onActive: (event, ctx: any) => {
      offset.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      offset.value = withDecay({
        velocity: event.velocityY,
        clamp: [-(max - 1) * ITEM_HEIGHT, 0],
      });
      runOnJS(() => {
        value.value = offset.value;
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
    </PanGestureHandler>
  );
};

export default GestureHandler;
