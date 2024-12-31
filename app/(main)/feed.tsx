import { View, Text, Dimensions, FlatList } from "react-native";
import React, { useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FRAME_DATA } from "@/constants/frameData";
import VideoComponent from "@/components/VideoComponent";

const Feed = () => {
  const { width, height } = Dimensions.get("window");
  const { charSelected } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
    }
  ).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={{ height }}>
        <VideoComponent videoUri={item.video} shouldPlay />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "coral" }}>
      <FlatList
        data={FRAME_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

export default Feed;
