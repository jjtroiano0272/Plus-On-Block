import { StyleSheet, View, Text, Pressable, Alert, Button } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { AppSettingsContext } from "@/context/AppSettings";
import { useAnswers } from "@/context/AnswerContext";
import { router, useRouter } from "expo-router";
import { hitSlop30 } from "@/helpers/common";

interface Props {
  videoUri: any;
  shouldPlay: boolean;
}

const Advertisement = ({
  videoUri = {
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  shouldPlay,
}: Props) => {
  const { appSettings } = useContext(AppSettingsContext);
  const { setCorrectAnswer, setSubmittedAnswer, numAnswered, setNumAnswered } =
    useAnswers();
  const videoRef = useRef<Video>(null);
  const router = useRouter();
  const [selectedNum, setSelectedNum] = useState(0);
  const [doneButtonDisabled, setDoneButtonDisabled] = useState(true);

  const handlePress = () => {
    Alert.alert("Goes to ad link");
  };

  useEffect(() => {
    setTimeout(() => {
      setDoneButtonDisabled(false);
      setNumAnswered(0);
    }, 5000);
  }, []);

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Pressable style={styles.closeButtonContainer} hitSlop={hitSlop30}>
        <Button
          disabled={doneButtonDisabled}
          title="Done"
          onPress={() => router.replace("/(main)/summary")}
        />
      </Pressable>
      <Video
        style={styles.fullVideo}
        ref={videoRef}
        source={videoUri}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={false}
        isLooping={true}
      />
    </Pressable>
  );
};

export default Advertisement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center", // originally flex-end
    // alignItems: "center",
    // backgroundColor: "black",
    position: "relative",
  },
  fullVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",

    width: "100%",
    height: "100%",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 40 * 3,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
});
