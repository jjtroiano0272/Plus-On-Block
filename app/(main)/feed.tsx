import * as Haptics from "expo-haptics";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FRAME_DATA } from "@/constants/frameData";
import QuizCard from "@/components/QuizCard";
import { useAnswers } from "@/context/AnswerContext";
import { IconButton, Portal, useTheme } from "react-native-paper";
import { formatFrameAdv, printFrameAdvantage } from "@/helpers/common";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import { AppSettingsContext } from "@/context/AppSettings";
import { Slider } from "react-native-awesome-slider";

const ITEM_WIDTH = 80; // Item width + marginHorizontal * 2
const { width, height } = Dimensions.get("window");

const Feed = () => {
  const theme = useTheme();
  const { charSelected } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { appSettings } = useContext(AppSettingsContext);
  const videoRef = useRef<Video>(null);
  const {
    setSubmittedAnswer,
    setCorrectAnswer,
    correctAnswer,
    submittedAnswer,
  } = useAnswers();

  const SCREEN_WIDTH = Dimensions.get("window").width;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
        console.log(
          `viewableItems[0].index: ${JSON.stringify(
            viewableItems[0].index,
            null,
            2
          )}`
        );
      } else {
        console.log(`no items visible`);
      }
    }
  ).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const progress = useSharedValue(50);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Debugging: Log the item to confirm what is being passed
    console.log(`Rendering item at index ${index}:`, item);

    return (
      <View style={styles.cardView}>
        <QuizCard videoUri={item.video} shouldPlay isAd={item?.isAd} />
      </View>
    );

    if (!item?.isAd) {
      return (
        <Pressable
          style={styles.container}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <Video
            style={styles.fullVideo}
            ref={videoRef}
            source={item?.videoUri}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isMuted={false}
            isLooping={appSettings.loopOrPlayOnce !== "loop" ? true : false}
          />
          <Pressable
            style={styles.sliderContainer}
            onPress={() => {
              console.log("\x1b[32m" + "Slider Pressed");
            }}
          >
            <Slider
              progress={progress}
              minimumValue={min}
              maximumValue={max}
              onHapticFeedback={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
            />
          </Pressable>
        </Pressable>
      );
    }

    // Fallback for unexpected cases
    return <View style={{ height: 200, backgroundColor: "red" }} />;
  };

  //   Handlng answers
  useEffect(() => {
    console.log(`submittedAnswer: ${JSON.stringify(submittedAnswer, null, 2)}`);
    // if (!submittedAnswer || !correctAnswer) return;
    if (currentIndex === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    if (submittedAnswer !== correctAnswer) {
      setModalVisible(true);
      //   progress to next index
      //   return;
    } else {
      setModalVisible(true);
      // Alert.alert(`Correct!`);
      //   return;
    }

    // or whatever your data source is
    if (currentIndex < FRAME_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.warn(`end of list!`);
    }
  }, [submittedAnswer]);

  useEffect(() => {
    console.log(`currentIndex: ${JSON.stringify(currentIndex, null, 2)}`);
  }, [currentIndex]);

  const flatListRef = useRef<FlatList<number>>(null);

  const [modalVisible, setModalVisible] = useState(false);

  //   const scrollX = useSharedValue(0);
  //   const onScrollHandler = useAnimatedScrollHandler({
  //     onScroll: (e) => {
  //       scrollX.value = e.contentOffset.x;
  //     },
  //   });

  return (
    <View
      style={{ flex: 1, backgroundColor: "coral" }}
      //   onPress={() => setModalVisible(false)}
    >
      <Portal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(!modalVisible);
          }}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: theme.colors.backdrop },
              ]}
            >
              <Text
                style={[styles.modalText, { color: theme.colors.onBackground }]}
              >
                {submittedAnswer !== correctAnswer
                  ? `Wrong! You are ${printFrameAdvantage(correctAnswer)}`
                  : "Correct!"}
              </Text>
              <IconButton
                onPress={() => setModalVisible(!modalVisible)}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                icon={"close"}
                containerColor="coral"
              />
            </View>
          </View>
        </Modal>
      </Portal>

      <FlatList
        ref={flatListRef}
        data={FRAME_DATA}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // Ensure unique keys
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: height * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          console.warn("Scroll to index failed:", info);
          flatListRef.current?.scrollToIndex({
            index: info.highestMeasuredFrameIndex,
            animated: true,
          });
        }}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  cardView: {
    height: height,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center", // originally flex-end
    alignItems: "center",
    // backgroundColor: "black",
    position: "relative",
  },
  smallVideo: {
    position: "absolute",
    // top: 0,
    // left: 0,
    justifyContent: "center",

    width: "95%", // set to 100 to make full screen video
    height: "40%", // Fullscreen video
    borderRadius: 20,
  },
  fullVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",

    width: "100%",
    height: "100%",
  },
  mainContainer: {
    position: "absolute",
    bottom: 80, // Adjust based on your design
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    position: "relative",
    alignItems: "center",
  },
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: "#b58df1",
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    fontSize: 24,
    color: "#f8f9ff",
  },
  directianRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
  sliderContainer: {
    width: "100%",
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 45,
    height: 100,
  },
});
