import {
  View,
  Text,
  Pressable,
  StyleSheet,
  PressableProps,
} from "react-native";
import React from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface SpringButtonProps extends PressableProps {
  children?: React.ReactNode;
  buttonStyle?: object;
  textStyle?: object;
}

const SpringButton: React.FC<SpringButtonProps> = ({
  onPress,
  children,
  buttonStyle,
  textStyle,
  disabled,
  ...restProps
}) => {
  const scale = useSharedValue(1);

  const displaceColor = (initalColor: string, amount: number): string => {
    return (
      "#" +
      Math.round(parseInt(initalColor.replace("#", "0x"), 16) * amount)
        .toString(16)
        .toUpperCase()
    );
  };

  const handleButtonPress = (event: any) => {
    // Sequence: quickly scale down, then spring back up
    scale.value = withTiming(0.8, { duration: 100 }, () => {
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
      });
    });

    // Forward the event to the passed onPress handler if it exists
    onPress?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: -scale.value }],
    };
  });
  const animatedButtonColor = useAnimatedStyle(() => {
    const initialColor = "#494368";

    return {
      // transform: [{ scale: -scale.value }],
      // backgroundColor: "purple",
      backgroundColor: interpolateColor(
        scale.value,
        [0, 1],
        [initialColor, displaceColor(initialColor, 1.2)]
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={handleButtonPress} disabled={disabled} {...restProps}>
        <Animated.View
          style={[
            animatedStyle,
            styles.button,
            animatedButtonColor,
            buttonStyle,
          ]}
        >
          <Text style={[styles.buttonText, animatedTextStyle, textStyle]}>
            {children}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default SpringButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "menlo",
  },
});
