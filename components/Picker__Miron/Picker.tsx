import { palette } from "@/constants/Colors";
import { printFrameAdvantage, SCREEN_WIDTH } from "@/helpers/common";
import * as Haptics from "expo-haptics";
import React, { useRef, useEffect } from "react";
import {
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
  FadeIn,
  SlideInRight,
  SlideInUp,
  SlideInDown,
} from "react-native-reanimated";

export const minVal = -10;
const segmentsLength = 21;
const segmentWidth = 7; // 2
const segmentSpacing = 36;
export const snapSegment = segmentWidth + segmentSpacing;
const spacerWidth = (SCREEN_WIDTH - segmentWidth) / 2;
const rulerWidth = spacerWidth * 2 + (segmentsLength - 1) * snapSegment;
const indicatorWidth = 100;
const indicatorHeight = 80;
const rulerData = [...Array(segmentsLength).keys()].map((i) => i + minVal);

const getBackgroundColor = (i, tenth) => {
  if (i < 0 && !tenth) return palette.plus;
  if (i < 0 && tenth) return "#FA9F9F";
  // if (tenth) return "#333";

  if (i > 0 && !tenth) return palette.negative;
  if (i > 0 && tenth) return "#035E00";
  // return "#999";
  if (i === 0) return "#999";
};

const Ruler = () => {
  return (
    <View style={styles.ruler}>
      <View style={styles.spacer} />
      {rulerData.map((i) => {
        const tenth = i % 10 === 0;
        return (
          <View
            key={i}
            style={[
              styles.segment,

              {
                backgroundColor: getBackgroundColor(i, tenth),
                height: tenth ? 40 : 20,
                marginRight: i === rulerData.length - 1 ? 0 : segmentSpacing,
              },
            ]}
          />
        );
      })}
      <View style={styles.spacer} />
    </View>
  );
};

const Picker = () => {
  const theme = useTheme();
  const scrollViewRef = useRef(null);
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const scrollX = useSharedValue(0); // Reanimated shared value
  const initialVal = 0;

  // old Scroll handler
  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     scrollX.value = event.contentOffset.x;
  //     // Update the TextInput on the JS thread
  //     runOnJS(updateTextInput)(
  //       Math.round(scrollX.value / snapSegment) + minAge
  //     );
  //   },
  // });
  const scrollHandler = (event) => {
    // per docs:
    //    offsetY.value = event.contentOffset.y;

    console.log(Object.keys(event));
    scrollX.value = event.nativeEvent.contentOffset.x;

    runOnJS(updateTextInput)(Math.round(scrollX.value / snapSegment) + minVal);

    // if (scrollX.value === Math.round(scrollX.value / snapSegment) + minAge) {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // }
  };

  // Update TextInput with the current age
  const updateTextInput = (age) => {
    console.log(`age: ${JSON.stringify(age, null, 2)}`);
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({
        text: `${printFrameAdvantage(age)}`,
      });
    }
  };

  // Scroll to the initial age on mount
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (scrollViewRef.current) {
  //       scrollViewRef.current.scrollTo({
  //         x: (initialVal - minVal) * snapSegment,
  //         y: 0,
  //         animated: true,
  //       });
  //     }
  //   }, 1000);
  // }, []);

  let debug = true;
  if (debug) {
    return (
      <FlatList
        ref={flatListRef}
        data={rulerData}
        renderItem={({ item, index }) => {
          // [revioously on map()]
          const tenth = index % 10 === 0;
          return (
            <View style={[]}>
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: getBackgroundColor(index, tenth),
                    height: tenth ? 40 : 20,
                    marginRight:
                      index === rulerData.length - 1 ? 0 : segmentSpacing,
                  },
                ]}
              />
            </View>
          );
        }}
        horizontal
        contentContainerStyle={[styles.scrollViewContainerStyle, styles.ruler]}
        // bounces={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={snapSegment}
        decelerationRate={"fast"}
        onScroll={scrollHandler}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <Image source={require("./assets/cake.gif")} style={styles.cake} /> */}
      {/* <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={styles.scrollViewContainerStyle}
        bounces={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={snapSegment}
        decelerationRate={"fast"}
        entering={SlideInDown}
        onScroll={
          scrollHandler
          // (event) => {
          //   console.log(Object.keys(event));
          // }
        } // Attach the Reanimated scroll handler
      >
        <Ruler />
      </Animated.ScrollView> */}

      {/* Turn the scrollview into a flatlist */}
      <FlatList
        data={rulerData}
        renderItem={({ item, index }) => {
          // [revioously on map()]
          const tenth = index % 10 === 0;
          return (
            <View style={[]}>
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: getBackgroundColor(index, tenth),
                    height: tenth ? 40 : 20,
                    marginRight:
                      index === rulerData.length - 1 ? 0 : segmentSpacing,
                  },
                ]}
              />
            </View>
          );
        }}
        // renderItem={({ item, index }) => {
        //   const getBackgroundColor = (i, tenth) => {
        //     if (i < 0 && !tenth) return palette.plus;
        //     if (i < 0 && tenth) return "#FA9F9F";
        //     // if (tenth) return "#333";

        //     if (i > 0 && !tenth) return palette.negative;
        //     if (i > 0 && tenth) return "#035E00";
        //     // return "#999";
        //     if (i === 0) return "#999";
        //   };

        //   return (
        //     <View style={styles.ruler}>
        //       <View style={styles.spacer} />
        //       {rulerData.map((i) => {})}
        //       <View style={styles.spacer} />
        //     </View>
        //   );
        // }}
        ref={flatListRef}
        horizontal
        contentContainerStyle={[styles.scrollViewContainerStyle, styles.ruler]}
        bounces={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={snapSegment}
        decelerationRate={"fast"}
        onScroll={scrollHandler}
      />

      <View style={styles.indicatorWrapper}>
        <TextInput
          ref={textInputRef}
          style={[styles.ageTextStyle, { color: theme.colors.onBackground }]}
          defaultValue={"+0"}
        />
        <View style={[styles.segment, styles.segmentIndicator]} />
      </View>
    </SafeAreaView>
  );
};

export default Picker;

const styles = StyleSheet.create({
  indicatorWrapper: {
    position: "absolute",
    left: (SCREEN_WIDTH - indicatorWidth) / 2,
    bottom: 34,
    alignItems: "center",
    justifyContent: "center",
    width: indicatorWidth,
  },
  segmentIndicator: {
    height: indicatorHeight,
    backgroundColor: "turquoise",
  },
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // position: "relative",
  },
  cake: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    resizeMode: "cover",
  },
  ruler: {
    opacity: 0.9,
    width: rulerWidth,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  segment: {
    width: segmentWidth,
  },
  scrollViewContainerStyle: {
    // justifyContent: "flex-end",
  },
  ageTextStyle: {
    fontSize: 42,
    fontFamily: "Helvetica",
    fontWeight: "100",
  },
  spacer: {
    width: spacerWidth,
    // backgroundColor: "red",
  },
});
