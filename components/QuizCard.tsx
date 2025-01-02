import * as Haptics from "expo-haptics";
import HorizontalPicker from "react-native-number-horizontal-picker";
// import FloatingActionButton from "@/components/FloatingActionButton";
// import Slider from "@/components/Slider";
import { Slider } from "react-native-awesome-slider";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { AppSettingsContext } from "@/context/AppSettings";
import { IconButton } from "react-native-paper";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import BottomRowTools from "./BottomRowTools";
import MainRowActions from "./MainRowActions";
import { router } from "expo-router";
import { FRAME_DATA } from "@/constants/frameData";
import { useAnswers } from "@/context/AnswerContext";
import { printFrameAdvantage } from "@/helpers/common";
import CandillonSlider from "./CandillonSlider";
import { SliderWithLottie } from "./SliderWithLottie";
import DiscreteSlider from "./RNAS_Examples/with-step";

const closeButtonHitSlop = 30;
const SCREEN_WIDTH = Dimensions.get("window").width;

const QuizCard = ({
  videoUri,
  shouldPlay,
  isAd,
}: {
  videoUri: any;
  shouldPlay: boolean;
  isAd?: boolean;
}) => {
  const { appSettings } = useContext(AppSettingsContext);
  const {
    submittedAnswer,
    correctAnswer,
    setCorrectAnswer,
    setSubmittedAnswer,
  } = useAnswers();
  const videoRef = useRef<Video>(null);
  const progress = useSharedValue(50);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const [selectedNum, setSelectedNum] = useState(0);

  useEffect(() => {
    videoRef.current?.setIsMutedAsync(true);
    if (shouldPlay) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.stopAsync();
    }
  }, [shouldPlay]);

  const submitAnswer = (answer: number) => {
    let fullObj = FRAME_DATA.find((e) => e.video === videoUri);
    let res = FRAME_DATA?.find((e) => e?.video === videoUri)?.advantage;

    if (res) {
      // previously on
      // setSubmittedAnswer(answer);
      // setCorrectAnswer(-res);

      // setCurrentIndex(index); // Optionally update the parent state if needed

      let userAnswer = answer.toString();
      let correctAnswer = (-res).toString();

      if (userAnswer === correctAnswer) {
        setSubmittedAnswer(userAnswer);
        setCorrectAnswer(correctAnswer);
      } else {
        setSubmittedAnswer(userAnswer);
        setCorrectAnswer(correctAnswer);
      }
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      "Are you sure you want to go back?",
      "This will reset your current progress",
      [
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => {
            return;
          },
        },
        {
          text: "Go back",
          onPress: () => {
            router.replace("/(main)/charSelect");
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        submitAnswer(selectedNum);
      }}
    >
      <Video
        style={!isAd ? styles.smallVideo : styles.fullVideo}
        ref={videoRef}
        source={videoUri}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={!isAd ? true : false}
        isLooping={appSettings.loopOrPlayOnce !== "loop" ? true : false}
      />
      {/* <BottomRowTools /> */}
      {/* <MainRowActions onPress={handleAnswer} /> */}

      {!isAd && (
        <Pressable
          style={styles.sliderContainer}
          onPress={() => {
            console.log("\x1b[32m" + "hi. Pressed slider container");
          }}
        >
          {/* <Slider
            progress={progress}
            minimumValue={min}
            maximumValue={max}
            onHapticFeedback={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            hapticMode="step"
            steps={20}
            markStyle={{
              width: 4,
              height: 4,
              backgroundColor: "#fff",
              position: "absolute",
              top: 50,
            }}
            renderBubble={() => (
              <View
                style={{
                  borderRadius: 20,
                  height: 100,
                  width: 100,
                  backgroundColor: progress.value < 50 ? "red" : "blue",
                }}
              >
                <Text>{progress.value}</Text>
              </View>
            )}
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
              // width: "100%",
              height: 50,
              borderRadius: 2,
              borderColor: "transparent",
              overflow: "hidden",
              borderWidth: 1,
            }}
            style={{
              backgroundColor: "#ccc",
              borderRadius: 15,
              padding: 20,
            }}
          /> */}
          {/* <CandillonSlider /> */}
          {/* <SliderWithLottie /> */}
          <DiscreteSlider setSelectedNum={setSelectedNum} />
        </Pressable>
      )}

      <Pressable
        style={{
          position: "absolute",
          top: 40,
          left: 15,
          width: "100%",
        }}
        onPress={handleGoBack}
        hitSlop={{
          top: closeButtonHitSlop,
          right: closeButtonHitSlop,
          bottom: closeButtonHitSlop,
          left: closeButtonHitSlop,
        }}
      >
        <IconButton onPress={handleGoBack} icon={"close"} />
      </Pressable>
    </Pressable>
  );
};

export default QuizCard;

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: "#b58df1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    color: "#f8f9ff",
  },
});

const styles = StyleSheet.create({
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
