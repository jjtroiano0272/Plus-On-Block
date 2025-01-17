import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import {
  View,
  SectionList,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import QuizCard from "@/components/QuizCard";
import { useAnswers } from "@/context/AnswerContext";
import {
  IconButton,
  Portal,
  Modal,
  useTheme,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import {
  printFrameAdvantage,
  SCREEN_WIDTH,
  WINDOW_HEIGHT,
  shuffleArray,
} from "@/helpers/common";
import { Video } from "expo-av";
import { AppSettingsContext } from "@/context/AppSettings";
import { Colors, palette } from "@/constants/Colors";
import { fetchData } from "@/services/dataService";
import { supabase } from "@/lib/supabase";
import Picker from "@/components/Picker__Miron/Picker";
import Loading from "@/components/Loading";
// import { fetchData } from "@/services/dataService";

const ITEM_WIDTH = 80; // Item width + marginHorizontal * 2
const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

export const audioFiles = {
  correct: require("@/assets/audio/correct.mp3"),
  incorrect: require("@/assets/audio/incorrect.mp3"),
};

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

var limit = 0;
const Feed = () => {
  const theme = useTheme();
  const { charSelected } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { appSettings } = useContext(AppSettingsContext);
  const videoRef = useRef<Video>(null);
  const flatListRef = useRef<FlatList<number>>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false); // Track if the modal was dismissed manually
  const showModal = () => setModalVisible(true);
  const [sound, setSound] = useState<Audio.Sound>();
  const [endOfList, setEndOfList] = useState(false);
  // get data from API
  // const [shuffledData, setShuffledData] = useState(shuffleArray(FRAME_DATA));
  const [shuffledData, setShuffledData] = useState([]);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    description: "",
  });
  const [followUpQuestion, setFollowUpQuestion] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isShuffling, setIsShuffling] = useState(false);
  const [listKey, setListKey] = useState(0); // Add a key to force FlatList re-render
  const [sections, setSections] = useState([]);

  const {
    setSubmittedAnswer,
    setCorrectAnswer,
    correctAnswer,
    submittedAnswer,
    numAnswered,
    setNumAnswered,
    numCorrect,
    setNumCorrect,
    selectedCharacter,
  } = useAnswers();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideModal = () => {
    // modalVisible && setModalVisible(false);

    // setModalDismissed(true); // Mark modal as dismissed
    // setModalVisible(false); // Hide the modal

    setModalDismissed(true); // Mark modal as dismissed
    setModalVisible(false); // Hide the modal
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any active timeout
      timeoutRef.current = null;
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
        console.log(
          `viewableItems[0].index: ${JSON.stringify(
            viewableItems[0].index,
            null,
            2
          )}`
        );
      } else {
        console.log(`no items visible`);
      }
    }
  ).current;

  const playSound = async (fileName: keyof typeof audioFiles) => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(audioFiles[fileName]);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  };

  /* =====================================================================================
  === Handlng answers =============================================
  ========================================================================================= */

  const handleCheckAnswer = (userAnswer: number) => {
    let correctAnswer = -FRAME_DATA[currentIndex].advantage;

    console.log(`correctAnswer: ${JSON.stringify(correctAnswer, null, 2)}`);

    // or whatever your data source is
    if (currentIndex < FRAME_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.warn(`end of list!`);
      setEndOfList(true);
      // increment index to go to 'play again' page
    }

    setNumAnswered(numAnswered + 1);
    setModalVisible(true);
    setModalDismissed(false); // Reset the dismissed flag when modal opens

    if (userAnswer !== correctAnswer) {
      playSound("incorrect");
      setModalMessage({
        title: `Wrong!`,
        description: `You are ${printFrameAdvantage(correctAnswer)}`,
      });
    } else {
      playSound("correct");
      setModalMessage({ title: `Correct!`, description: `` });
      setNumCorrect(numCorrect + 1);
    }
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setShuffledData(shuffleArray(FRAME_DATA));
      setListKey((prevKey) => prevKey + 1); // Increment the key to force FlatList re-render
      setIsShuffling(false);
      setEndOfList(false);
    }, 1500); // Simulate a small delay for shuffling
  };

  const showFollowUpQuestion = (answer) => {
    setCurrentStep(2);

    // handleCheckAnswer(answer);
  };

  const getData = async () => {
    // if (!hasMore) {
    //   return null;
    // }

    // limit = limit + 3;

    let res = await fetchData(limit);

    if (res.success) {
      // setShuffledData(shuffleArray(res.data));
      setShuffledData(res?.data);
      console.log(`res.data: ${JSON.stringify(res.data, null, 2)}`);
    }
  };

  const getVideos = async () => {
    const { data, error } = await supabase
      .from("moves")
      .select("*")
      .order("created_at", { ascending: false });
    console.log(data);
    getSignedUrls(data);
  };

  const getSignedUrls = async (videos: string[]) => {
    const { data, error } = await supabase.storage
      .from("video")
      .createSignedUrls(
        videos.map((map) => video.uri),
        60 * 60 * 24 * 7
      );

    let videoUrls = videos?.map((item) => {
      item.signedUrl = data?.find(
        (signedUrl) => signedUrl.path === item.uri
      )?.signedUrl;
      return item;
      // npx prisma init --datasource-provider postgresql
    });

    console.log(`data: ${JSON.stringify(data, null, 2)}`);
  };

  useEffect(() => {
    if (modalVisible && !modalDismissed) {
      timeoutRef.current = setTimeout(() => {
        setModalVisible(false);
        timeoutRef.current = null;
      }, 1500);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clean up any timeout
        timeoutRef.current = null;
      }
    };
  }, [modalVisible, modalDismissed]);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    // setShuffledData(shuffleArray(FRAME_DATA));
  }, [endOfList]);

  // Get data from server on mount
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(`shuffledData: ${JSON.stringify(shuffledData, null, 2)}`);
  }, [shuffledData]);

  const groupDataIntoSections = (data) => {
    const grouped = data.reduce((acc, item, index) => {
      const sectionIndex = Math.floor(index / 10); // Group every 10 items
      if (!acc[sectionIndex]) {
        acc[sectionIndex] = { title: `Section ${sectionIndex + 1}`, data: [] };
      }
      acc[sectionIndex].data.push(item);
      return acc;
    }, []);
    return grouped;
  };

  useEffect(() => {
    const shuffled = shuffleArray(FRAME_DATA);
    const groupedData = groupDataIntoSections(shuffled);
    setSections(groupedData);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "coral" }}>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          style={{
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "",
          }}
          contentContainerStyle={[
            styles.modalContainer,
            {
              width: SCREEN_WIDTH * 0.5,
              borderWidth: 2,
              borderRadius: 20,
              borderColor: modalMessage.description.includes("+")
                ? palette.plus
                : palette.negative,
            },
          ]}
        >
          {
            <>
              <Text style={{ fontSize: 42, color: theme.colors.onBackground }}>
                {modalMessage.title}
              </Text>

              <Text style={{ fontSize: 16, color: theme.colors.onBackground }}>
                {modalMessage.description}
              </Text>
            </>
          }
        </Modal>
      </Portal>

      {isShuffling ? (
        // <LottieView
        //   style={[styles.centeredView]}
        //   source={require("@/assets/animations/shuffle.json")}
        //   autoPlay
        //   loop
        // />
        <View style={styles.centeredView}>
          <Loading />
        </View>
      ) : (
        <FlatList
          key={listKey} // Use the dynamic key here
          ref={flatListRef}
          data={[...shuffledData, { id: "end" }]}
          extraData={shuffledData}
          onEndReached={() => setEndOfList(true)}
          renderItem={({ item }) =>
            item.id !== "end" ? (
              <View style={styles.cardView}>
                <QuizCard
                  // videoUri={item.video}
                  remoteVideoUri={item.video_clip}
                  submitAnswerBubble={(answer) => {
                    //  handleCheckAnswer(answer)
                    console.log(`submit answer bubble`);
                  }}
                  isViewable={currentIndex === item.id}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.cardView,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text
                  style={{ fontSize: 42, color: theme.colors.onBackground }}
                >
                  You've reached the end. Shuffle and play again?
                </Text>
                <Button
                  children="YES"
                  style={{ margin: 30 }}
                  onPress={handleShuffle}
                />
              </View>
            )
          }
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          } // Ensure unique keys
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: WINDOW_HEIGHT * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            console.warn("Scroll to index failed:", info);
            flatListRef.current?.scrollToIndex({
              index: info.highestMeasuredFrameIndex,
              animated: true,
            });
          }}
        />
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  cardView: {
    height: WINDOW_HEIGHT,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center", // originally flex-end
    alignItems: "center",
    // backgroundColor: "black",
    position: "relative",
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
  modalContainer: {
    backgroundColor: "#cccccc70",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
