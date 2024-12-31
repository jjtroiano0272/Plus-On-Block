import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useRef } from "react";

export const SliderItem = ({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress?: (arg?: any) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item - 10)}
      style={styles.itemContainer}
    >
      <View style={styles.button}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "800" }}>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MySlider = ({
  data,
  onPressItem,
}: {
  data: any;
  onPressItem: (index: number) => void;
}) => {
  const flatListRef = useRef<FlatList<number>>(null);

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index} onPress={onPressItem} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        // initialScrollIndex={10}
        onScrollToIndexFailed={(info) => {
          console.warn("Scroll to index failed:", info);
          flatListRef.current?.scrollToIndex({
            index: info.highestMeasuredFrameIndex,
            animated: true,
          });
        }}
        decelerationRate="fast"
      />
    </View>
  );
};

export default MySlider;

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    // gap: 0,
    width: 90 + 30,
  },
  button: {
    // flex: 1,
    height: 90,
    width: 90,
    borderRadius: 200,
    backgroundColor: "#cccccc80",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "orange",
    borderWidth: 2,
  },
});
