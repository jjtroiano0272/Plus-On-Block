// import Picker from "@/components/Picker__Candillon/Picker";
import IndicatorExample from "@/components/Picker_Medium/Picker";
import Picker from "./Picker__Miron/Picker";
// import Picker from "react-native-picker-horizontal";
import * as Haptics from "expo-haptics";
import { Text, Image, StyleSheet, Alert, Pressable, View } from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ResizeMode, Video } from "expo-av";
import { AppSettingsContext } from "@/context/AppSettings";
import { Avatar, Icon, IconButton, useTheme } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { useAnswers } from "@/context/AnswerContext";
import {
  buttonIcons,
  hitSlop30,
  hp,
  SCREEN_HEIGHT,
  wp,
} from "@/helpers/common";
import DiscreteSlider from "./RNAS_Examples/DiscreteSlider";
import DirectionalSelector from "./LeverAndButtons";
import LeverAndButtons from "./LeverAndButtons";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ScreenWrapper from "./ScreenWrapper";

const QuizCard = ({
  videoUri,
  isViewable,
  isAd,
  submitAnswerBubble,
  remoteVideoUri,
}: {
  videoUri?: any;
  isViewable: boolean;
  isAd?: boolean;
  submitAnswerBubble: (answer: number) => void;
  remoteVideoUri?: string;
}) => {
  const theme = useTheme();
  const { appSettings } = useContext(AppSettingsContext);
  const {
    setCorrectAnswer,
    setSubmittedAnswer,
    numAnswered,
    selectedCharacter,
  } = useAnswers();
  const videoRef = useRef<Video>(null);
  const [selectedNum, setSelectedNum] = useState(0);

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
            // Probably get numAnswered from context
            if (numAnswered === 0) {
              router.replace("/(main)/charSelect");
            } else if (numAnswered >= 20) {
              // if you've answered more than 20 questions, go to ad, then reset counter
              router.replace("/(main)/advertisement");
            } else {
              router.replace("/(main)/summary");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    // videoRef.current?.setIsMutedAsync(true);
    if (isViewable) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.stopAsync();
    }

    console.log(`isViewable: ${JSON.stringify(isViewable, null, 2)}`);
  }, [isViewable]);

  const [currentStep, setCurrentStep] = useState(1);
  const [showFollowUp, setShowFollowUp] = useState(true);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const Items = Array.from(Array(30).keys());
  const itemWidth = 50;

  const start = 1900;
  const defaultValue = 1990 - start;
  const values = new Array(new Date().getFullYear() - start + 1)
    .fill(0)
    .map((_, i) => {
      const value = start + i;
      return { value, label: `${value}` };
    })
    .reverse();

  return (
    <ScreenWrapper>
      <Pressable
        style={styles.container}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (showFollowUp && currentStep === 1) {
            setCurrentStep(2);
          } else {
            // submitAnswer(selectedNum);
            submitAnswerBubble(selectedNum);
          }
        }}
      >
        <View style={styles.header}>
          <IconButton
            onPress={handleGoBack}
            icon={"close"}
            hitSlop={hitSlop30}
            // style={styles.closeButton}
          />
          <Avatar.Image
            size={42}
            source={
              CHARACTER_AVATARS?.find((x) => x.name === selectedCharacter)
                ?.image
            }
            style={{ borderRadius: 10 }}
          />
        </View>
        {/* =====================================================================================
        === Top PArt =============================================
        ========================================================================================= */}
        <View
          style={styles.videoContainer}
          // hitSlop={hitSlop30}
        >
          <View style={styles.video}>
            <Video
              style={styles.smallVideo}
              ref={videoRef}
              source={{
                uri: "https://gizdlefrudtlzzlsdhyk.supabase.co/storage/v1/object/public/video/Ryu_5LP.mov",
              }}
              resizeMode={ResizeMode.COVER}
              shouldPlay={true}
              isMuted={true}
              isLooping={appSettings.loopOrPlayOnce == "loop" ? true : false}
            />
          </View>
        </View>

        {/* =====================================================================================
            === Bottom part =============================================
            ========================================================================================= */}
        <View style={styles.endContainer}>
          {/* <DiscreteSlider
            setSelectedNum={setSelectedNum}
            selectedNum={selectedNum}
          /> */}
          <View
            style={{
              backgroundColor: "turquoise",
              marginHorizontal: wp(4),
              borderRadius: 20,
            }}
          >
            <Picker />
          </View>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Icon source={"chevron-down"} size={24} />
        </View>
      </Pressable>
    </ScreenWrapper>
  );
};

export default QuizCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center", // originally flex-end
    // alignItems: "center",
    // backgroundColor: "black",
    // position: "relative",
    // paddingHorizontal: wp(4),
  },
  smallVideo: {
    // position: "absolute",
    // top: 20,
    // left: 0,
    // justifyContent: "center",

    width: "100%", // set to 100 to make full screen video
    height: "100%", // Fullscreen video
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
    // flexDirection: "row",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 45,
    height: 200,
  },
  closeButtonContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 15,
    width: "100%",
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },

  videoContainer: {
    flex: 4,
    position: "relative",
    // backgroundColor: "#cccccc50", // Placeholder color for the video section
    paddingVertical: hp(5),
    paddingHorizontal: wp(4),
  },
  video: {
    flex: 1,
    // height: SCREEN_HEIGHT * 0.3
  },

  endContainer: {
    flex: 4,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flex: 1,
    paddingHorizontal: wp(4),
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
