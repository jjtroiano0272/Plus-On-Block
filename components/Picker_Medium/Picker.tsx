import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolation,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHaptic } from "@/hooks/useHaptic";

const { width, height } = Dimensions.get("screen");

const textColor = "#2A3B38";
const gray = "#A0A0A0";
// const slideWidth = width * 0.75;
const slideWidth = 20;
// const slideHeight = height * 0.5;
const slideHeight = 200;

const choices = Array.from({ length: 20 }, (_, i) => i);

const TickMark = () => {
  return <View style={{ borderWidth: 1, borderColor: "red", height: 40 }} />;
};

const Slide = ({ slide, scrollOffset, index }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / slideWidth;
    const inputRange = [index - 1, index, index + 1];

    return {
      transform: [
        {
          scale: interpolate(
            input,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      key={index}
      style={[
        {
          flex: 1,
          width: slideWidth,
          height: slideHeight,
          paddingVertical: 10,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          padding: 10,
          alignItems: "center",
          borderColor: textColor,
          borderWidth: 3,
          borderRadius: 10,
          height: "100%",
          justifyContent: "center",
        }}
      >
        {/* <Ionicons name={slide.icon} size={100} color={textColor} />
        <Text
          style={{
            color: textColor,
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {slide.text}
        </Text> */}
        <TickMark />
      </View>
    </Animated.View>
  );
};

const Indicator = ({ scrollOffset, index }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / slideWidth;
    const inputRange = [index - 1, index, index + 1];
    const animatedColor = interpolateColor(input, inputRange, [
      gray,
      textColor,
      gray,
    ]);

    return {
      width: interpolate(input, inputRange, [20, 40, 20], Extrapolation.CLAMP),
      backgroundColor: animatedColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          marginHorizontal: 5,
          height: 20,
          borderRadius: 10,
          backgroundColor: textColor,
        },
        animatedStyle,
      ]}
    />
  );
};

const IndicatorExample = () => {
  const hapticSelection = useHaptic();

  const scrollViewRef = useRef(null);
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;

      if (event.contentOffset.x % slideWidth === 0) {
        // hapticSelection();
        console.log(`haptics would go here`);
      }
    },
  });

  return (
    <SafeAreaView
      style={
        {
          // flex: 1,
          // justifyContent: "space-around",
        }
      }
    >
      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        horizontal
        snapToInterval={slideWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: (width - slideWidth) / 2,
          justifyContent: "center",
        }}
        onScroll={scrollHandler}
      >
        {choices.map((slide, index) => {
          return (
            <Slide
              key={index}
              index={index}
              slide={slide}
              scrollOffset={scrollOffset}
            />
          );
        })}
      </Animated.ScrollView>
      {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        {choices.map((_, index) => {
          return (
            <Indicator key={index} index={index} scrollOffset={scrollOffset} />
          );
        })}
      </View> */}

      {/* <View>
        <TextInput ref={textInputRef} style={styles.ageTextStyle} />
        <View style={[styles.segment, styles.segmentIndicator]} />
      </View> */}
    </SafeAreaView>
  );
};

export default IndicatorExample;

const styles = StyleSheet.create({
  ageTextStyle: {},
  segment: {},
  segmentIndicator: {},
});
