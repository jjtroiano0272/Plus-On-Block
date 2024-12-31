import * as Haptics from "expo-haptics";
import HorizontalPicker from "react-native-number-horizontal-picker";
// import FloatingActionButton from "@/components/FloatingActionButton";
import Slider from "@/components/Slider";
import { Slider as AwesomeSlder } from "react-native-awesome-slider";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { height } = Dimensions.get("screen");
const closeButtonHitSlop = 30;

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 120;

const FloatingActionButton = ({
  isExpanded,
  index,
  buttonLetter,
  onPress,
}: {
  isExpanded: SharedValue<boolean>;
  index: number;
  buttonLetter: string;
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    const translateY = isExpanded.value ? -OFFSET * index : 0; // Move upwards based on index
    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: withSpring(translateY, SPRING_CONFIG) },
        { scale: withTiming(scaleValue, { duration: 300 }) },
      ],
    };
  });

  return (
    <AnimatedPressable
      style={[animatedStyles, styles.shadow, styles.button]}
      onPress={onPress}
    >
      <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
    </AnimatedPressable>
  );
};

const VideoComponent = ({
  videoUri,
  shouldPlay,
}: {
  videoUri: any;
  shouldPlay: boolean;
}) => {
  const { appSettings } = useContext(AppSettingsContext);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (shouldPlay) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.stopAsync();
    }
  }, [shouldPlay]);

  const sliderProgress = useSharedValue(0);
  const min = useSharedValue(-10);
  const max = useSharedValue(10);

  const negativeIsExpanded = useSharedValue(false);
  const plusIsExpanded = useSharedValue(false);

  const handlePress = (buttonPressed: "negative" | "zero" | "plus") => {
    if (buttonPressed === "negative") {
      negativeIsExpanded.value = !negativeIsExpanded.value;
    }
    if (buttonPressed === "zero") {
      Alert.alert("Zero registered as answer!");
    }
    if (buttonPressed === "plus") {
      plusIsExpanded.value = !plusIsExpanded.value;
    }
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      Number(negativeIsExpanded.value),
      [0, 1],
      [0, 2]
    );
    const translateValue = withTiming(moveValue);
    const rotateValue = negativeIsExpanded.value ? "45deg" : "0deg";

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  {
    /* <View style={{ position: "absolute", bottom: 300, right: 200 }}>
        <AwesomeSlder
          progress={sliderProgress}
          minimumValue={min}
          maximumValue={max}
          forceSnapToStep
          steps={20}
          onHapticFeedback={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // HapticFeedback.trigger("selection")
          }}
          hapticMode="step"
        />
      </View> */
  }

  const handleIndexChange = (index: number) => {
    console.log(`@handleIndexChange index: ${index}`);

    // setCurrentIndex(index); // Optionally update the parent state if needed
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
    <View style={styles.container}>
      <Video
        style={styles.video}
        ref={videoRef}
        source={videoUri}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={appSettings.loopOrPlayOnce !== "loop" ? true : false}
      />
      {/* <BottomRowTools /> */}
      <MainRowActions onPress={handleIndexChange} />
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

      {/* /**
|--------------------------------------------------
| A
|--------------------------------------------------
 */}
      {/* <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <AnimatedPressable
            onPress={() => handlePress()}
            style={[styles.shadow, mainButtonStyles.button]}
          >
            <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
              +
            </Animated.Text>
          </AnimatedPressable>
          <FloatingActionButton
            isExpanded={negativeIsExpanded}
            index={1}
            buttonLetter={"M"}
          />
          <FloatingActionButton
            isExpanded={negativeIsExpanded}
            index={2}
            buttonLetter={"W"}
          />
          <FloatingActionButton
            isExpanded={negativeIsExpanded}
            index={3}
            buttonLetter={"S"}
          />
        </View>
      </View> */}

      {/* =====================================================================================
=== B =============================================
========================================================================================= */}
      {/* <View style={styles.iconContainer}>
        <IconButton
          style={styles.icon}
          size={30}
          icon={"heart"}
          onPress={() => Alert.alert("press!")}
        />
        <IconButton style={styles.icon} size={30} icon={"home"} />
      </View> */}
    </View>
  );
};

export default VideoComponent;

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
    justifyContent: "flex-end",
    backgroundColor: "black",
    position: "relative",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%", // Fullscreen video
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
});
