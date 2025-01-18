import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  RadialGradient,
} from "react-native-svg";

interface CircuitButtonProps extends PressableProps {
  children?: React.ReactNode;
  buttonStyle?: object;
  textStyle?: object;
  circuitColor?: string;
}

const HeartbeatButton: React.FC<CircuitButtonProps> = ({
  onPress,
  children,
  buttonStyle,
  textStyle,
  disabled,
  circuitColor = "#00ff00",
  ...restProps
}) => {
  const scale = useSharedValue(1);
  const circuitProgress = useSharedValue(0);
  const gradientOpacity = useSharedValue(0.5);
  const isAnimating = useSharedValue(false);

  // Button dimensions
  const WIDTH = 200;
  const HEIGHT = 80;
  const RADIUS = 40;
  const PERIMETER = 2 * (WIDTH + HEIGHT);

  // Node positions (as percentages of the path length)
  const NODES = [0, 25, 50, 75].map((percent) => ({
    percent,
    offset: (percent / 100) * PERIMETER,
  }));

  const createCircuitPath = () => {
    return `
      M ${RADIUS} 0
      H ${WIDTH - RADIUS}
      A ${RADIUS} ${RADIUS} 0 0 1 ${WIDTH} ${RADIUS}
      V ${HEIGHT - RADIUS}
      A ${RADIUS} ${RADIUS} 0 0 1 ${WIDTH - RADIUS} ${HEIGHT}
      H ${RADIUS}
      A ${RADIUS} ${RADIUS} 0 0 1 0 ${HEIGHT - RADIUS}
      V ${RADIUS}
      A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0
      Z
    `;
  };

  const handleButtonPress = (event: GestureResponderEvent) => {
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });

    if (!isAnimating.value) {
      isAnimating.value = true;

      // Animate multiple circuit layers with different timings
      circuitProgress.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        2,
        false,
        () => {
          isAnimating.value = false;
          circuitProgress.value = 0;
        }
      );

      // Pulse the gradient using correct easing
      gradientOpacity.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withTiming(0.3, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        4,
        true
      );
    }

    onPress?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={handleButtonPress} disabled={disabled} {...restProps}>
        <Animated.View style={[animatedStyle, styles.button, buttonStyle]}>
          <Text style={[styles.buttonText, textStyle]}>{children}</Text>

          <View style={styles.circuitContainer}>
            <Svg height={HEIGHT} width={WIDTH} style={StyleSheet.absoluteFill}>
              <Defs>
                {/* Main circuit gradient */}
                <LinearGradient
                  id="circuitGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <Stop offset="0" stopColor={circuitColor} stopOpacity="1" />
                  <Stop
                    offset="0.5"
                    stopColor={circuitColor}
                    stopOpacity={gradientOpacity}
                  />
                  <Stop offset="1" stopColor={circuitColor} stopOpacity="1" />
                </LinearGradient>

                {/* Glow effect for nodes */}
                <RadialGradient
                  id="nodeGlow"
                  cx="50%"
                  cy="50%"
                  rx="50%"
                  ry="50%"
                >
                  <Stop offset="0%" stopColor={circuitColor} stopOpacity="1" />
                  <Stop
                    offset="100%"
                    stopColor={circuitColor}
                    stopOpacity="0"
                  />
                </RadialGradient>
              </Defs>

              {/* Background glow layer */}
              <Path
                d={createCircuitPath()}
                stroke={circuitColor}
                strokeWidth="4"
                strokeOpacity="0.2"
                fill="none"
              />

              {/* Multiple circuit layers with different opacities */}
              {[0.8, 0.6, 0.4].map((opacity, index) => (
                <Path
                  key={`circuit-${index}`}
                  d={createCircuitPath()}
                  stroke="url(#circuitGradient)"
                  strokeWidth={2 + index}
                  strokeDasharray={PERIMETER}
                  strokeDashoffset={circuitProgress}
                  strokeOpacity={opacity}
                  fill="none"
                />
              ))}

              {/* Circuit nodes */}
              {NODES.map((node, index) => (
                <Circle
                  key={`node-${index}`}
                  cx={WIDTH * (node.percent / 100)}
                  cy={node.percent < 50 ? 0 : HEIGHT}
                  r="4"
                  fill="url(#nodeGlow)"
                />
              ))}

              {/* Spark effects */}
              {NODES.map((node, index) => (
                <Circle
                  key={`spark-${index}`}
                  cx={WIDTH * (node.percent / 100)}
                  cy={node.percent < 50 ? 0 : HEIGHT}
                  r="2"
                  fill={circuitColor}
                  opacity={gradientOpacity}
                />
              ))}
            </Svg>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "purple",
    width: 200,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "menlo",
  },
  circuitContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
  },
});

export default HeartbeatButton;
