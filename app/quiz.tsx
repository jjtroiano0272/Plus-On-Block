import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import HorizontalPicker from "react-native-number-horizontal-picker";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import data, { locationImage } from "@/constants/catalinData";
import { FRAME_DATA } from "@/constants/frameData";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  useTheme,
} from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import MyCard from "@/components/MyCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import Slider from "@/components/Slider";
import { Slider as AwesomeSlder } from "react-native-awesome-slider";
import { useLocalSearchParams } from "expo-router";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import { ResizeMode, Video } from "expo-av";

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

const colors = {
  primary: "#6667AB",
  light: "#fff",
  dark: "#111",
};

export default function StackCards() {
  const { charSelected } = useLocalSearchParams();
  const theme = useTheme();
  const activeIndex = useSharedValue(0);

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (activeIndex.value === 0) {
        console.log(`Zero! Return...`);

        return;
      }
      activeIndex.value = withTiming(activeIndex.value - 1, { duration });
      console.log(`fling up`);
    });

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (activeIndex.value === data.length) {
        console.log(`End of list!`);

        return;
      }

      activeIndex.value = withTiming(activeIndex.value + 1, { duration });
      console.log(`fling down`);
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart((ev) => {
      // "worklet";
      // runOnJS(setIsMenuVisible)(false);
      Alert.alert("Swipe right");
    });

  const handleReset = () => {
    activeIndex.value = withTiming(activeIndex.value + 1);
    // TODO shuffle cars
    // TODO reset score
  };

  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [modalMessage, setModalMessage] = useState("");
  // const containerStyle = { backgroundColor: "white", padding: 20 };

  // "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const videoSource = require("@/assets/video/5LK.mov");
  const player = useVideoPlayer(videoSource, (player) => {
    // player.muted = true; // Mute for autoplay
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    console.log(`isPlaying: ${JSON.stringify(isPlaying, null, 2)}`);
  }, [isPlaying]);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
  }, [modalVisible]);

  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      {/* <StatusBar hidden /> */}
      <View
        style={{
          borderRadius: 10,
          borderColor: "gray",
          borderWidth: 3,
        }}
      >
        <Image
          source={CHARACTER_AVATARS.find((e) => e.name === charSelected)?.image}
          style={{ height: 30, width: 30, resizeMode: "contain" }}
        />
      </View>

      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <GestureDetector
        gesture={Gesture.Exclusive(
          flingUp,
          flingDown
          // flingRight,
          // flingLeft
        )}
      >
        {/* {activeIndex.value === FRAME_DATA.length - 1 ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ThemedText style={{ fontSize: 72 }}>Play again?</ThemedText>
          </View> */}

        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: layout.cardsGap * 2,
          }}
          pointerEvents="box-none"
        >
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
          <Text style={{ color: "white" }}>
            FRAME_DATA.length - 1: {FRAME_DATA.length - 1}
          </Text>

          {FRAME_DATA.map((attack, index) => (
            <MyCard
              key={attack.id}
              info={attack}
              activeIndex={activeIndex}
              index={index}
              totalLength={FRAME_DATA.length - 1}
              setModalMessage={setModalMessage}
              setModalVisible={setModalVisible}
            />
          ))}

          {activeIndex.value === FRAME_DATA.length - 1 && (
            <>
              <Text style={{ fontSize: 72 }}>Play Again?</Text>
              <Button onPress={handleReset} children={"Reset"} />
            </>
          )}

          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={hideModal}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              contentContainerStyle={{
                backgroundColor: theme.colors.background,
                padding: 20,
                justifyContent: "center",
                alignItems: "center",
                // width: width / 2,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 42, color: theme.colors.onBackground }}>
                {modalMessage}
              </Text>
            </Modal>
          </Portal>
        </View>
      </GestureDetector>
    </View>
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
    shadowColor: colors.dark,
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 5,
  },
  title: { fontSize: 32, fontWeight: "600" },
  subtitle: {},
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
  icon: {},
  video: {
    width: 300,
    height: 275,
    zIndex: 10001,
  },
});
