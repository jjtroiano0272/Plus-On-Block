import VideoPlayer from "@/components/VideoPlayer";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import { palette } from "@/constants/Colors";
import { AppSettingsContext } from "@/context/AppSettings";
import {
  defaultVideoUri,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  wp,
} from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { fetchData } from "@/services/dataService";
import { ResizeMode, Video } from "expo-av";
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
} from "react-native";
import { Avatar, Button, Icon, IconButton, useTheme } from "react-native-paper";

const MY_SECTIONS = [
  // CARD 1
  {
    title: "LP",
    data: [
      {
        key: "1",
        // text: "Item text 1",
        uri: "https://gizdlefrudtlzzlsdhyk.supabase.co/storage/v1/object/sign/video/Ryu_5MP.mov?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby9SeXVfNU1QLm1vdiIsImlhdCI6MTczNjYzMzU4MiwiZXhwIjoxNzM3MjM4MzgyfQ.ka8XNt-fvq2F95TixmrzchsjV92a4Rzw3ClchiGdIf0",
      },
    ],
  },
  {
    title: "Ryu_1",
    horizontal: true,
    data: [{}],
  },
  // CARD 2
  {
    title: "MP",
    data: [
      {
        key: "1",
        // text: "Item text 1",
        // uri: "https://picsum.photos/id/1011/200",
      },
    ],
  },
  {
    title: "Ryu_2",
    horizontal: true,
    data: [{}],
  },
];

let DEBUG_DATA = [
  {
    title: "LP",
    // key: "1",
    uri: "https://gizdlefrudtlzzlsdhyk.supabase.co/storage/v1/object/sign/video/Ryu_5MP.mov?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby9SeXVfNU1QLm1vdiIsImlhdCI6MTczNjYzMzU4MiwiZXhwIjoxNzM3MjM4MzgyfQ.ka8XNt-fvq2F95TixmrzchsjV92a4Rzw3ClchiGdIf0",
  },
  {
    title: "MP",
    // key: "1",
    uri: "https://gizdlefrudtlzzlsdhyk.supabase.co/storage/v1/object/sign/video/Ryu_5MP.mov?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby9SeXVfNU1QLm1vdiIsImlhdCI6MTczNjYzMzU4MiwiZXhwIjoxNzM3MjM4MzgyfQ.ka8XNt-fvq2F95TixmrzchsjV92a4Rzw3ClchiGdIf0",
  },
];

const ListItem = ({ item, activeIndex }) => {
  const { appSettings } = useContext(AppSettingsContext);
  const videoRef = useRef<Video>(null);

  // Checking that activeIndex === item.id, which sets the video to play if true
  console.log(`activeIndex: ${JSON.stringify(typeof activeIndex, null, 2)}`);
  console.log(`item: ${JSON.stringify(typeof item.id, null, 2)}`);

  const player = useVideoPlayer(
    "https://gizdlefrudtlzzlsdhyk.supabase.co/storage/v1/object/public/video/Ryu_5LP.mov",
    (player) => {
      player.loop = appSettings.loopOrPlayOnce === "loop" ? true : false;
      player.muted = true;
      player.play();
    }
  );

  return (
    <Pressable style={styles.item} onPress={() => Alert.alert("Check answer")}>
      {/* <Text style={{ color: "red", fontSize: 10 }}>
        {JSON.stringify(item, null, 2)}
      </Text> */}

      {/* From expo-video (new) */}
      {/* <VideoView
        style={styles.videoView}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
      /> */}

      {/* From expo AV (old) */}
      {/* <Video
        style={styles.video}
        ref={videoRef}
        source={{
          uri: defaultVideoUri,
          // uri: item?.signedUrl,
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isMuted={true}
        isLooping={appSettings.loopOrPlayOnce == "loop" ? true : false}
      /> */}
      {/* VideoPlayer is NOT the problem, nesting it like this */}
      <VideoPlayer
        video={item}
        isViewable={activeIndex === item.id}
        loop={appSettings.loopOrPlayOnce == "loop" ? true : false}
      />
    </Pressable>
  );
};

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

const getBackgroundColor = (i, tenth) => {
  if (i < 0 && !tenth) return palette.plus;
  if (i < 0 && tenth) return "#FA9F9F";
  // if (tenth) return "#333";

  if (i > 0 && !tenth) return palette.negative;
  if (i > 0 && tenth) return "#035E00";
  // return "#999";
  if (i === 0) return "#999";
};

const Spacer = ({ style = {} }: { style?: ViewStyle }) => {
  return (
    <View
      style={[
        style,
        {
          backgroundColor: "#ccc",
          width: "60%",
          height: 5,
          borderRadius: 10,
          marginVertical: 100, // seems to be able to be adjust without causing offset issues
        },
      ]}
    />
  );
};

var limit = 0;
const DEBUG = () => {
  const [activeIndex, setActiveIndex] = useState<number | string | null>(null);
  const theme = useTheme();
  const [shuffledData, setShuffledData] = useState<
    {
      error: string | null;
      path: string | null;
      signedUrl: string;
    }[]
  >([]);

  const getData = async () => {
    // if (!hasMore) {
    //   return null;
    // }

    limit = limit + 3;

    let res = await fetchData(limit);

    if (res?.success) {
      // setShuffledData(shuffleArray(res.data));
      // setShuffledData(res?.data);

      console.log(`res: ${JSON.stringify(res, null, 2)}`);
    }
  };

  const getVideos = async () => {
    try {
      const { data, error } = await supabase.storage.from("video").list();

      const dataWithIds = data.map((x, index) => ({
        ...x,
        id: (index - 1).toString(),
      }));
      let fileNames = dataWithIds.map((x) => x.name);

      getSignedUrls(fileNames);
    } catch (err) {
      console.error(err);
    }
  };

  const getSignedUrls = async (videos: any[]) => {
    try {
      let cachePeriod = 60 * 60 * 24 * 7;

      const { data, error } = await supabase.storage
        .from("video")
        .createSignedUrls(videos, cachePeriod);

      // data basically looks like the one in the video
      // console.log(`@getSignedUrlsdata: ${JSON.stringify(data, null, 2)}`);

      // let videoUrls = videos.map((item) => {
      //   item.signedUrl = data?.find(
      //     (signedUrl) => signedUrl.signedUrl === item.uri
      //   )?.signedUrl;

      //   return item;
      // });
      // console.log(
      //   "\x1b[35m" + `videoUrls: ${JSON.stringify(videoUrls, null, 2)}`
      // );

      let newData = data.map((x, index) => ({ ...x, id: index.toString() }));

      setShuffledData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // getData();
    getVideos();
  }, []);

  {
    /* =====================================================================================
  === Represents a whole card =============================================
  ========================================================================================= */
  }
  const renderSection = ({ item, index }) => (
    <View style={styles.section}>
      <Text style={{ fontSize: 10 }}>{JSON.stringify(item)}</Text>

      <IconButton icon={"reload"} onPress={getVideos} />
      {/* <Text style={styles.sectionTitle}>Section {index + 1}</Text> */}

      {/* VIDEO */}
      <ListItem item={item} activeIndex={activeIndex} />
      {/* <Button onPress={getVideos} children="getVideos" mode="outlined" /> */}
      <Spacer />

      {/* RULER */}
      <FlatList
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
        horizontal
        data={Array.from({ length: 10 }, (_, i) => i + 1)} // section.data
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
      />

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginVertical: 20,
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
      snapToAlignment="start"
      decelerationRate="fast"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onViewableItemsChanged={(e) =>
        setActiveIndex(e.viewableItems[0].key.toString())
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
});
