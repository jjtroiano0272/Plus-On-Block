import Picker from "@axenuab/react-native-haptic-wheel-picker";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import VideoPlayer from "@/components/VideoPlayer";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import { palette } from "@/constants/Colors";
import { AppSettingsContext } from "@/context/AppSettings";
import {
  defaultVideoUri,
  getBackgroundColor,
  printFrameAdvantage,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WINDOW_HEIGHT,
  wp,
} from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { fetchData, fetchVideos } from "@/services/dataService";
import { Audio, ResizeMode, Video } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  Alert,
  ViewStyle,
  TextInput,
} from "react-native";
import { Avatar, Button, Icon, IconButton, useTheme } from "react-native-paper";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import ScrollableSelector from "@/components/ScrollableSelector";
import Loading from "@/components/Loading";

const minVal = -10;
const segmentsLength = 21;
const segmentWidth = 7; // 2
const segmentSpacing = 36;
const snapSegment = segmentWidth + segmentSpacing;
const spacerWidth = (SCREEN_WIDTH - segmentWidth) / 2;
const rulerWidth = spacerWidth * 2 + (segmentsLength - 1) * snapSegment;
const indicatorWidth = 100;
const indicatorHeight = 80;
const rulerData = [...Array(segmentsLength).keys()].map((i) => i + minVal);
var limit = 0;
var possibleFrameValues = Array.from({ length: 21 }, (_, i) =>
  i - 10 >= 0 ? `+${i - 10}` : `${i - 10}`
);

interface ListItemProps {
  item: any;
  activeIndex: string | number;
  currentAnswer: string;
}
const ListItem = ({ item, activeIndex, currentAnswer }: ListItemProps) => {
  const { appSettings } = useContext(AppSettingsContext);

  const videoRef = useRef<Video>(null);
  const [sound, setSound] = useState<Audio.Sound>();

  const playSound = async (fileName: keyof typeof audioFiles) => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(audioFiles[fileName]);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  };

  // Checking that activeIndex === item.id, which sets the video to play if true
  // console.log(`activeIndex: ${JSON.stringify(typeof activeIndex, null, 2)}`);

  const handleCheckAnswer = (foo, currentAnswer) => {
    // Alert.alert("@handleCheckAnswer", JSON.stringify(foo, null, 2));

    console.log(`currentAnswer: ${JSON.stringify(currentAnswer, null, 2)}`);
    console.log(
      `-foo.advantage_on_block: ${JSON.stringify(
        -foo.advantage_on_block,
        null,
        2
      )}`
    );
    if (currentAnswer === printFrameAdvantage(-foo?.advantage_on_block)) {
      playSound("correct");

      Alert.alert("Correct!");
    } else {
      playSound("incorrect");

      Alert.alert(
        "Wrong!",
        `You are ${printFrameAdvantage(-foo?.advantage_on_block)} on block.`
      );
    }

    // Then progress to next card
  };

  return (
    <Pressable
      style={styles.item}
      onPress={() => handleCheckAnswer(item, currentAnswer)}
    >
      {/* VideoPlayer is NOT the problem, nesting it like this */}
      <VideoPlayer
        video={item}
        isViewable={activeIndex === item.id}
        loop={appSettings.loopOrPlayOnce == "loop" ? true : false}
      />
    </Pressable>
  );
};

const audioFiles = {
  correct: require("@/assets/audio/correct.mp3"),
  incorrect: require("@/assets/audio/incorrect.mp3"),
};

const DEBUG = () => {
  const [activeIndex, setActiveIndex] = useState<number | string | null>(null);
  const theme = useTheme();
  const textInputRef = useRef(null);
  const scrollX = useSharedValue(0); // Reanimated shared value
  const [currentAnswer, setCurrentAnswer] = useState("+0");
  const [hasMore, setHasMore] = useState(true);
  const [shuffledData, setShuffledData] = useState<
    {
      error: string | null;
      path: string | null;
      signedUrl: string;
    }[]
  >([]);

  const getVideos = async () => {
    try {
      // const { data, error } = await supabase.storage.from("video").list();
      const { data, error } = await supabase
        .from("moves")
        .select("*")
        .order("id", { ascending: true });

      console.log(
        `@getVideos data (expecting uri to just be filename): ${JSON.stringify(
          data,
          null,
          2
        )}`
      );

      // const dataWithIds = data.map((x, index) => ({
      //   ...x,
      //   id: (index - 1).toString(),
      // }));
      // let fileNames = dataWithIds.map((x) => x.name);

      // getSignedUrls(fileNames);
      getSignedUrls(data);
    } catch (err) {
      console.error(err);
    }
  };

  const newGetVideos = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    let res = await fetchVideos(limit);

    if (res.success) {
      if (shuffledData.length == res?.data?.length) {
        setHasMore(false);
      }

      // TODO probably still needs shuffling though
      setShuffledData(res.data);
    }
  };

  const getSignedUrls = async (videos: any[]) => {
    try {
      let cachePeriod = 60 * 60 * 24 * 7;

      console.log("\x1b[34m" + `videos: ${JSON.stringify(videos, null, 2)}`);
      const { data: bucketContents } = await supabase.storage
        .from("video")
        .list();
      let res = bucketContents.map((e) => e.name);
      console.log(
        `bucketContents (everything that needs to go to be set as uri in db): ${JSON.stringify(
          res,
          null,
          2
        )}`
      );

      const { data, error } = await supabase.storage
        .from("video")
        // This part REQUIRES just the filename, the way it's setup.
        .createSignedUrls(
          videos.map((video) => video.uri),
          // ["Ryu_5LP.mov"],
          cachePeriod
        );

      console.log(
        "\x1b[32m" + `@getSignedUrls data: ${JSON.stringify(data, null, 2)}`
      );

      if (!hasMore) return null;

      // sets flatlist data
      setShuffledData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onViewableItemsChanged = (e) => {
    console.log(`viewableItemsChangex ${JSON.stringify(e.changed, null, 2)}`);
  };

  const scrollHandler = (event) => {
    // per docs:
    //    offsetY.value = event.contentOffset.y;

    // console.log(Object.keys(event));
    scrollX.value = event.nativeEvent.contentOffset.x;

    runOnJS(updateTextInput)(Math.round(scrollX.value / snapSegment) + minVal);

    // if (scrollX.value === Math.round(scrollX.value / snapSegment) + minVal) {
    // if (scrollX.value % snapSegment === 0) {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // }

    console.log(`scrollX value: ${scrollX.value}`);
    // snapSegment 43

    // if (scrollX.value % snapSegment === 0) {
    if (scrollX.value / snapSegment + (minVal % snapSegment) === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const updateTextInput = (frameAdv: number) => {
    console.log(`frameAdv: ${JSON.stringify(frameAdv, null, 2)}`);

    if (textInputRef.current) {
      console.log(`ref active`);

      textInputRef.current.setNativeProps({
        text: `${printFrameAdvantage(frameAdv)}`,
      });
    }
  };

  useEffect(() => {
    // getData();
    // getVideos();
    newGetVideos();
  }, []);

  const renameStorageFiles = async () => {
    const { error } = await supabase
      .from("your_table_name")
      // .update({
      //   numPadNotation: supabase.sql`REPLACE(numPadNotation, '.', '')`,
      // })
      // .like("numPadNotation", "%.%");
      .select("*");

    if (error) {
      console.error("Error updating records:", error);
    } else {
      console.log("Records updated successfully.");
    }
  };
  {
    /* =====================================================================================
  === Represents a whole card =============================================
  ========================================================================================= */
  }
  const renderSection = ({ item, index }) => (
    <View style={styles.section}>
      {/* <ThemedText style={{ fontSize: 10 }}>{JSON.stringify(item)}</ThemedText> */}

      <IconButton
        icon={"reload"}
        onPress={
          // getVideos
          renameStorageFiles
        }
      />
      {/* <Text style={styles.sectionTitle}>Section {index + 1}</Text> */}

      {/* VIDEO */}
      <ListItem
        item={item}
        activeIndex={activeIndex}
        currentAnswer={currentAnswer}
      />
      {/* <Button onPress={getVideos} children="getVideos" mode="outlined" /> */}

      {/* SPACER */}
      <View
        style={[
          styles.spacer,
          {
            backgroundColor: theme.colors.elevation.level1,
          },
        ]}
      />

      {/* RULER */}
      {/* <FlatList
        style={{
          //   height: SCREEN_HEIGHT * 0.3,
          backgroundColor: "turquoise",
          borderRadius: 20,
          paddingHorizontal: wp(4),
        }}
        contentContainerStyle={{
          // backgroundColor: "turquoise",
          // height: 300, don't think this one is used
          justifyContent: "center",
          alignItems: "center",
        }}
        snapToInterval={snapSegment}
        onViewableItemsChanged={onViewableItemsChanged}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        horizontal
        // const rulerData = [...Array(segmentsLength).keys()].map((i) => i + minVal);
        // data={Array.from({ length: 10 }, (_, i) => i + 1)} // section.data
        data={[...Array(segmentsLength).keys()].map((i) => i + -10)} // section.data
        // initialScrollIndex={10}
        // getItemLayout={(_, index) => ({
        //   length: 80,
        //   offset: WINDOW_HEIGHT * index,
        //   index,
        // })}
        // onScrollToIndexFailed={() => {}}
        renderItem={({ item, index }) => {
          // Each tick on the ruler
          const tenth = index % 10 === 0;
          return (
            <View
              key={index}
              style={[
                {
                  width: segmentWidth,
                  backgroundColor: getBackgroundColor(index, tenth),
                  height: tenth ? 40 : 20,
                  marginRight:
                    index === rulerData.length - 1 ? 0 : segmentSpacing,
                },
              ]}
            />
          );
        }}
        showsHorizontalScrollIndicator={false}
      /> */}

      {/* @25:00 hour/min selctor starts */}
      <ScrollableSelector
        // visibleItems={3}
        onChange={(item) => {
          console.log(`item: ${JSON.stringify(item, null, 2)}`);
          // TODO Send this to handle check answer
          setCurrentAnswer(item);
        }}
        value={"+0"}
        data={possibleFrameValues}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginVertical: 20,
          opacity: 0.5,
        }}
      >
        <Icon source={"chevron-down"} size={24} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={shuffledData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderSection}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToAlignment="center"
      decelerationRate="fast"
      onScroll={scrollHandler}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onViewableItemsChanged={(e) =>
        setActiveIndex(e?.viewableItems?.[0]?.key?.toString())
      }
      onEndReached={newGetVideos}
      ListFooterComponent={
        hasMore ? (
          <View style={{ marginVertical: shuffledData.length == 0 ? 200 : 30 }}>
            <Loading />
          </View>
        ) : (
          <View style={[styles.section, { backgroundColor: "coral" }]}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 42 }}>No more cards!</Text>
            </View>
          </View>
        )
      }
    />
  );
};

export default DEBUG;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#121212",
  },
  sectionHeader: {
    fontWeight: "800",
    fontSize: 18,
    color: "#f4f4f4",
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    // flex: 1,
    // height: SCREEN_HEIGHT * 0.3, // 300
    height: 300, // 300
    width: "100%",
    // margin: 10,
    // backgroundColor: "#ccc",
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
  itemText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 5,
  },
  video: {
    // position: "absolute",
    // top: 20,
    // left: 0,
    // justifyContent: "center",
    // flex: 3,
    width: "100%", // set to 100 to make full screen video
    height: "100%", // Fullscreen video
    borderRadius: 20,
  },
  header: {
    flex: 1,
    paddingHorizontal: wp(4),
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  section: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    // paddingVertical: 80,
    paddingTop: 80,
    paddingBottom: 20,
  },
  sectionTitle: {
    position: "absolute",
    top: 40,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    zIndex: 1,
  },
  videoView: {
    height: 300, // 300
    width: "100%",
  },
  indicatorWrapper: {
    // position: "absolute",
    // left: (SCREEN_WIDTH - indicatorWidth) / 2,
    bottom: 34,
    alignItems: "center",
    justifyContent: "center",
    width: indicatorWidth,
  },
  ageTextStyle: {
    fontSize: 42,
    fontFamily: "Helvetica",
    fontWeight: "100",
    transform: [{ rotate: "10deg" }],
  },
  segmentIndicator: {
    height: indicatorHeight,
    backgroundColor: "turquoise",
  },
  segment: {
    width: segmentWidth,
  },
  spacer: {
    width: "60%",
    height: 5,
    borderRadius: 10,
    marginVertical: 100, // seems to be able to be adjust without causing offset issues
  },
});
