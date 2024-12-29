import { locationImage } from "@/constants/catalinData";
import { FRAME_DATA } from "@/constants/frameData";
import { Entypo } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Text,
  Image,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const duration = 300 * 2;
const _size = width * 0.9;
const layout = {
  borderRadius: 16,
  width: _size,
  height: _size * 1.27,
  spacing: 12,
  cardsGap: 22,
};
const maxVisibleItems = 1 + 3;
const possibleFrameValues = Array.from({ length: 21 }, (_, i) => i - 10);

const colors = {
  primary: "#6667AB",
  light: "#fff",
  dark: "#111",
};

export default function MyCard({
  info,
  index,
  totalLength,
  activeIndex,
  setModalMessage,
  setModalVisible,
}: {
  totalLength: number;
  index: number;
  info: (typeof FRAME_DATA)[0]; // not sure
  activeIndex: SharedValue<number>;
  setModalMessage: (msg: string) => void;
  setModalVisible: (visible: boolean) => void;
}) {
  const theme = useTheme();
  const sliderProgress = useSharedValue(0);
  const min = useSharedValue(-10);
  const max = useSharedValue(10);

  const stylez = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / maxVisibleItems, 1, 1]
      ),
      shadowOpacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0, 0, 1],
        { extrapolateRight: Extrapolation.CLAMP }
      ),
      shadowColor:
        selection === info.advantage
          ? "green"
          : selection !== info.advantage
          ? "red"
          : "black",
      transform: [
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [
              -layout.cardsGap,
              0,
              // layout.height - layout.cardsGap
              1000, // make exact dimensions
            ],
            { extrapolateRight: Extrapolation.EXTEND }
          ),
        },
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.96, 1, 0.96]
          ),
        },
      ],
    };
  });

  let mode = "custom";

  const [value, setValue] = useState();
  // const handleChangeValue = (arg) => {
  //   console.log(`val: ${JSON.stringify(arg, null, 2)}`);
  //   console.log(typeof arg);

  //   let res = Math.round(arg);
  //   setValue(res);
  // };
  const handlePressButton = (arg: string) => {
    setSelection(arg);
    setCurrentStep(2);
  };
  const [frameAdvantageAnswer, setFrameAdvantageAnswer] = useState<
    number | undefined
  >();

  const formatNumber = (num: number) => {
    if (num >= 0) {
      return `+${num}`;
    }

    return `${num}`;
  };

  // handle select answer
  const handleSelectFrameAdvantage = (selection: number) => {
    // Progress to next card
    activeIndex.value = withTiming(activeIndex.value + 1);
    setFrameAdvantageAnswer(selection);
    setCurrentStep(1);

    console.log(`info (answer): ${JSON.stringify(info.advantage, null, 2)}`);

    let res;

    if (selection === info.advantage) {
      setModalMessage(`Correct!`);
    } else {
      setModalMessage(`Wrong Answer. It is ${formatNumber(info.advantage)}`);
    }
    setModalVisible(true);
  };

  const [selection, setSelection] = useState<number | undefined>();
  const [currentStep, setCurrentStep] = useState(1);

  // const videoSource =
  // "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  // // require("@/assets/video/5LK.mov");
  // const player = useVideoPlayer(videoSource, (player) => {
  //   // player.muted = true; // Mute for autoplay
  //   player.loop = true;
  //   player.play();
  // });

  // const { isPlaying } = useEvent(player, "playingChange", {
  //   isPlaying: player.playing,
  // });

  // useEffect(() => {
  //   console.log(`isPlaying: ${JSON.stringify(isPlaying, null, 2)}`);
  // }, [isPlaying]);

  return (
    // <Animated.View
    //   style={[
    //     styles.card,
    //     stylez,
    //     {
    //       backgroundColor: theme.colors.background,
    //     },
    //   ]}
    // >
    //   <Pressable
    //     onPress={() => handleSelectFrameAdvantage(sliderProgress.value)}
    //     style={{
    //       width: "90%", // Scales the image width proportionally
    //       height: "70%", // Scales the image height proportionally
    //     }}
    //   >
    //     {/* {FRAME_DATA[index].image ? (
    //       <Image
    //         source={FRAME_DATA[index].image}
    //         style={{
    //           // flex: 1,
    //           // borderRadius: layout.borderRadius - layout.spacing / 2,
    //           overflow: "hidden",
    //           resizeMode: "contain",
    //           width: "90%", // Scales the image width proportionally
    //           height: "70%", // Scales the image height proportionally
    //         }}
    //       />
    //     ) : (
    //       <VideoView
    //         style={styles.video}
    //         player={player}
    //         allowsFullscreen
    //         allowsPictureInPicture
    //       />
    //     )} */}
    //     <Pressable onPress={(event) => event.stopPropagation()}>
    //       <VideoView
    //         style={styles.video}
    //         player={player}
    //         allowsFullscreen
    //         allowsPictureInPicture
    //       />
    //     </Pressable>
    //   </Pressable>
    //   {/* <Text>{JSON.stringify(FRAME_DATA[0])}</Text> */}

    //   <View
    //     style={{
    //       flexDirection: "row",
    //       gap: 30,
    //       justifyContent: "center",
    //       alignItems: "center",
    //       marginTop: 30,
    //     }}
    //   >
    //     {currentStep === 1 ? (
    //       <>
    //         {/* <IconButton
    //             icon={"minus"}
    //             onPress={() => handlePressButton("minus")}
    //             iconColor="white"
    //             containerColor="#282EA7"
    //             size={64}
    //           />
    //           <IconButton
    //             icon={"home"}
    //             onPress={() => handleSelectFrameAdvantage(0)}
    //             // iconColor="white"
    //             // containerColor="green"
    //             size={64}
    //           />
    //           <IconButton
    //             icon={"plus"}
    //             onPress={() => handlePressButton("plus")}
    //             iconColor="white"
    //             containerColor="#B8136A"
    //             size={64}
    //           /> */}
    //         {/* <FloatingActionButton /> */}
    //         {/* <Slider max /> */}
    //         <AwesomeSlder
    //           progress={sliderProgress}
    //           minimumValue={min}
    //           maximumValue={max}
    //           forceSnapToStep
    //           steps={20}
    //           onHapticFeedback={() => {
    //             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    //             // HapticFeedback.trigger("selection")
    //           }}
    //           hapticMode="step"
    //         />
    //       </>
    //     ) : (
    //       <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 7 }}>
    //         {Array.from({ length: 10 }).map((item, index) => (
    //           <Button
    //             key={index}
    //             mode="contained"
    //             onPress={() => handleSelectFrameAdvantage(index)}
    //             // iconColor="white"
    //             // containerColor="red"
    //             // size={64}
    //             children={index + 1}
    //           />
    //         ))}
    //       </View>
    //     )}
    //   </View>
    //   {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
    //       <Text style={{ fontSize: 20 }}>{value}</Text>
    //       <HorizontalPicker
    //         minimumValue={-10}
    //         maximumValue={10}
    //         focusValue={0}
    //         onChangeValue={handleChangeValue}
    //       />
    //     </View> */}
    // </Animated.View>
    // <VideoView
    //   style={styles.video}
    //   player={player}
    //   allowsFullscreen
    //   allowsPictureInPicture
    // />
    <Text>Test</Text>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.primary,
    padding: layout.spacing,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: layout.borderRadius,
    width: layout.width,
    height: layout.height * 1.5,
    padding: layout.spacing,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
  },
  cardContent: {
    gap: layout.spacing,
    marginBottom: layout.spacing,
  },
  locationImage: {
    flex: 1,
    borderRadius: layout.borderRadius - layout.spacing / 2,
  },
  row: {
    flexDirection: "row",
    columnGap: layout.spacing / 2,
    alignItems: "center",
  },
  video: {
    width: 300,
    height: 275,
    zIndex: 10001,
  },
});
