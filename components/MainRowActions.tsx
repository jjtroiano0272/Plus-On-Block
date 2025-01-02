import * as Haptics from "expo-haptics";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
  useColorScheme,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SymbolView } from "expo-symbols";
import { Button } from "react-native-paper";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { formatFrameAdv, wp } from "@/helpers/common";
import MySlider from "./MySlider";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { Slider } from "react-native-awesome-slider";
import { useAnswers } from "@/context/AnswerContext";

const options = Array.from({ length: 20 + 1 }, (_, i) => i - 10);
const ITEM_WIDTH = 80; // Item width + marginHorizontal * 2
const SCREEN_WIDTH = Dimensions.get("window").width;

const SLIDER_WIDTH = 300; // Width of the slider track
const SLIDER_HEIGHT = 40; // Height of the slider track
const THUMB_SIZE = 30; // Size of the slider thumb

interface Props {
  onPress: (index: any) => void;
  progress?: SharedValue<number>;
}

const MainRowActions = ({ onPress }: Props) => {
  const { submittedAnswer, correctAnswer, setSubmittedAnswer } = useAnswers();

  const flatListRef = useRef<FlatList<number>>(null);
  const [currentIndex, setCurrentIndex] = useState(10);
  const ref = React.useRef<ICarouselInstance>(null);
  //   const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        // Find the item closest to the center of the screen
        const centerItem = viewableItems.reduce((prev, current) => {
          return Math.abs(current.index - 10) < Math.abs(prev.index - 10)
            ? current
            : prev;
        });
        console.log(
          `@MainRowActions (child), current item under SymbolView: ${centerItem.item}`
        );

        onPress(centerItem.item);
        setCurrentIndex(centerItem.item);
      }
    }
  ).current;

  const handlePressItem = (index: number) => {
    let res = index + 10;
    console.log(`Item pressed: ${res}`);
    setCurrentIndex(index);
    onPress(res); // Optionally, pass the index up to the parent
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        key={item}
        style={{
          borderRadius: 200,

          backgroundColor:
            item === 0
              ? "#ccc"
              : item < 0
              ? "#FCE694"
              : item > 0
              ? "#C1DBE3"
              : "transparent",
          height: 60,
          width: 60,
          justifyContent: "center",
          alignItems: "center",
          zIndex: -10,
          opacity: 0.8 - Math.abs(item * 0.05),
          marginHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700" }}>{item}</Text>
      </View>
    );
  };

  useEffect(() => {
    // Wait for the FlatList to render before scrolling
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: ITEM_WIDTH * 10 - (SCREEN_WIDTH - ITEM_WIDTH) / 2, // Center index 10
        animated: false,
      });
    }
  }, []);

  const progress = useSharedValue(50);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        console.log("\x1b[32m" + "hi");
      }}
    >
      {/* <FlatList
        // contentContainerStyle={styles.scrollContent}
        style={styles.scrollOverlay}
        ref={flatListRef}
        horizontal
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        snapToInterval={ITEM_WIDTH} // Item width + horizontal margin
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        initialScrollIndex={8} // Start at index 10
        onScrollToIndexFailed={(info) => {
          console.warn("Scroll to index failed:", info);
          flatListRef.current?.scrollToIndex({
            index: info.highestMeasuredFrameIndex,
            animated: true,
          });
        }}
        decelerationRate="fast"
      />
      <TouchableOpacity style={styles.symbolOverlay} onPress={onPress}>
        <SymbolView
          size={90}
          type="hierarchical"
          name={"circle"}
          tintColor={"white"}
        />
      </TouchableOpacity> */}

      {/* <MySlider data={options} onPressItem={handlePressItem} /> */}
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onHapticFeedback={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        hapticMode="step"
        steps={20}
        bubbleContainerStyle={{
          height: 100,
          width: 100,
        }}
        bubbleTextStyle={{ fontSize: 40 }}
        bubble={(s) => formatFrameAdv(s)}
        bubbleTranslateY={-50}
        bubbleWidth={120}
        forceSnapToStep
        containerStyle={{
          width: SCREEN_WIDTH * 0.8,
        }}
        style={{
          backgroundColor: "#ccc",
          borderRadius: 15,
          padding: 20,
        }}
        // renderMark={({ index }) => (
        //   <View style={styles.mark}>
        //     <Text>{index * 10}</Text>
        //   </View>
        // )}
      />
    </Pressable>
  );
};

export default MainRowActions;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 45,
    height: 100,
  },
  mainSymbolContainer: {
    zIndex: 1, // Ensures the main symbol stays below the scrollable view
  },
  scrollOverlay: {
    // position: "absolute", // Superimposes the scroll view
    // top: 25, // Adjust this value to overlap with the main symbol
    // zIndex: 2, // Ensures the scroll view is above the main symbol
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Space between symbols in the scroll view
  },
  symbolOverlay: {
    position: "absolute",
    zIndex: 10,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: -45 }], // Center SymbolView (half of its size)
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: 50,
    backgroundColor: "#82cab2",
    borderRadius: 25,
    justifyContent: "center",
    padding: 5,
  },
  sliderHandle: {
    width: 40,
    height: 40,
    backgroundColor: "#f8f9ff",
    borderRadius: 20,
    position: "absolute",
    left: 5,
  },
  boxWidthText: {
    textAlign: "center",
    fontSize: 18,
  },
  slider: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    backgroundColor: "#ddd",
    borderRadius: 20,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#4CAF50",
    position: "absolute",
  },
  valueText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
