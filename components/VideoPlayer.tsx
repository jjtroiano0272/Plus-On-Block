import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import { ResizeMode, Video } from "expo-av";
import { defaultVideoUri } from "@/helpers/common";

const VideoPlayer = ({
  video,
  isViewable,
  loop,
}: {
  video: any;
  isViewable: boolean;
  loop: boolean;
}) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (isViewable) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isViewable]);

  return (
    <Video
      style={styles.video}
      ref={videoRef}
      source={{
        uri: video?.signedUrl,
        // uri: defaultVideoUri,
      }}
      resizeMode={ResizeMode.COVER}
      shouldPlay={true}
      isMuted={true}
      isLooping={loop}
    />
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  video: {
    width: "100%", // set to 100 to make full screen video
    height: "100%", // Fullscreen video
    borderRadius: 20,
  },
});
