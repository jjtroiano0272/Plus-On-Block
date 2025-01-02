import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { formatFrameAdv } from "@/helpers/common";
import { Video, ResizeMode } from "expo-av";
import { IconButton } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { AppSettingsContext } from "@/context/AppSettings";
import { useAnswers } from "@/context/AnswerContext";

const AdComponent = ({ videoUri }: { videoUri: string }) => {
  const { appSettings } = useContext(AppSettingsContext);
  const videoRef = useRef<Video>(null);
  const { setSubmittedAnswer, setCorrectAnswer, correctAnswer } = useAnswers();

  useEffect(() => {
    videoRef.current?.setIsMutedAsync(false);
    videoRef.current?.playAsync();
  }, []);

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
        source={videoUri}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={true}
        isLooping={appSettings.loopOrPlayOnce !== "loop" ? true : false}
      />
    </Pressable>
  );
};

export default AdComponent;

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
