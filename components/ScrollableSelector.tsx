import * as Haptics from "expo-haptics";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
} from "react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ViewStyle } from "react-native";
import { getItemColor, wp } from "@/helpers/common";
import { HapticFeedbackTypes } from "react-native-haptic-feedback";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  withTiming,
  Extrapolation,
} from "react-native-reanimated";
import { palette } from "@/constants/Colors";
import { useTheme } from "react-native-paper";

const ITEM_WIDTH = 60; // to width
const VISIBLE_ITEMS = 5;

interface Props<T> {
  value?: T;
  data: T[];
  itemWidth?: number; // to width
  visibleItems?: number;
  style?: StyleProp<ViewStyle>;
  renderItem?(item: T): ReactNode;
  onChange?(item: T): void;
}
const ScrollableSelector = <T extends unknown>({
  value,
  data,
  itemWidth = ITEM_WIDTH, // to width
  visibleItems = VISIBLE_ITEMS,
  style,
  renderItem,
  onChange,
}: Props<T>) => {
  //   const FLATLIST_HEIGHT = ITEM_HEIGHT * visibleItems; // to width
  const theme = useTheme();
  const FLATLIST_WIDTH = ITEM_WIDTH * visibleItems;
  const flatListRef = useRef<FlatList>(null);
  const handleScrollBegin = ({ nativeEvent }) => {
    console.log(`nativeEvent: ${JSON.stringify(nativeEvent, null, 2)}`);
  };

  const handleScroll = (
    // @20:00
    { nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if ((nativeEvent.contentOffset.x % itemWidth) / 2 === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const [currentlySelected, setCurrentlySelected] = useState<number>(0);

  const handleScrollEnd = (
    // @20:00
    { nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = nativeEvent.contentOffset.x;
    const index = offsetX / itemWidth; // to X

    console.log(`handleScrollEnd ${index}`);
    // data[index]

    setCurrentlySelected(index);

    onChange && onChange(data[index]);
  };

  useEffect(() => {
    if (flatListRef.current && value) {
      const defaultIndex = data.indexOf(value);

      if (defaultIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: defaultIndex,
            animated: true,
          });
        }, 100);
      }
    }
  }, [flatListRef, value]);

  const sv = useSharedValue<number>(14);
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      //   transform: [{ translateX: offset.value }],
      fontSize: sv.value + 50,
    };
  });

  useEffect(() => {
    // 10 is midpoint
    if (currentlySelected < 10) {
      progress.value = withTiming(0);
    } else if (currentlySelected === 10) {
      progress.value = withTiming(0.5);
    } else {
      progress.value = withTiming(1);
    }
  }, [currentlySelected]);

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.5, 1],
        ["#FA9F3050", "#CCCCCC50", "#035E7B50"]
        // ["#EC9F05", "#CCCCCC", "#8EA604"]
      ),
    };
  });

  return (
    <View
      style={{
        borderColor: theme.colors.outline,
        borderWidth: 1,
        borderRadius: 20,
        height: 200,
        // width: '100%'
      }}
    >
      {/* The indicator */}
      <Animated.View
        style={[
          styles.highlight,
          animatedStyle,
          {
            width: itemWidth,
            left: FLATLIST_WIDTH / 2,
            transform: [{ translateX: -(itemWidth / 2) }],
          },
        ]}
      />
      <FlatList
        horizontal
        ref={flatListRef}
        style={[
          styles.flatList,
          {
            width: FLATLIST_WIDTH,
            borderRadius: 20,
            // paddingHorizontal: wp(4)
          },
        ]} // to width
        data={data}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth} // to width
        getItemLayout={(_, index) => ({
          length: itemWidth, // to width
          offset: itemWidth * index, // to width
          index,
        })}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        decelerationRate={"fast"}
        contentContainerStyle={{
          paddingHorizontal: (FLATLIST_WIDTH - itemWidth) / 2, // to width
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isSelected = index === currentlySelected;
          const fontSize = isSelected ? 20 : 14;
          const color = isSelected ? "black" : "gray";

          return (
            <View style={[styles.itemContainer, { width: itemWidth }]}>
              <Text
                style={{
                  color: getItemColor(item),
                  fontSize: isSelected ? 22 : 16,
                  fontWeight: isSelected ? "bold" : "500",
                }}
              >
                {item}
              </Text>

              {/* To make it animatable */}
              {/* <TextInput
                style={[
                    animatedTextStyle,
                  {
                    color: getItemColor(item),
                    fontWeight: isSelected ? "bold" : "500",
                  },
                ]}
              >
                {item}
              </TextInput> */}
            </View>
          );
        }}
      />
    </View>
  );
};

export default ScrollableSelector;

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: ITEM_WIDTH, // to width
  },
  highlight: {
    position: "absolute",
    // width: "100%", // to width
    height: "100%",
    backgroundColor: "#f0f0f0",
    zIndex: 0,
  },
  flatList: { backgroundColor: "transparent", borderWidth: 0 },
});
