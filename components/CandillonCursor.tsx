import { StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

interface CursorProps {
  x: Animated.SharedValue<number>;
  size: number;
  count: number;
}

const CandillonCursor = ({ x, size, count }: CursorProps) => {
  const snapPoints = new Array(count).fill(0).map((_, i) => ({ x: i * size }));
  const index = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    index.value = Math.round(x.value / size);
    return {
      transform: [{ translateX: withSpring(x.value) }],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: () => {
      const snapTo = snapPoints.reduce((prev, curr) =>
        Math.abs(curr.x - x.value) < Math.abs(prev.x - x.value) ? curr : prev
      );
      x.value = withSpring(snapTo.x);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "white",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            justifyContent: "center",
            alignItems: "center",
          },
          animatedStyle,
        ]}
      >
        <Animated.Text style={{ fontSize: 24 }}>
          {index.value.toString()}
        </Animated.Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default CandillonCursor;
