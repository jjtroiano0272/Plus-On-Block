import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from "react-native";
import React, { useCallback, useContext, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  IconButton,
  SegmentedButtons,
  Switch,
  ToggleButton,
  useTheme,
} from "react-native-paper";
import { hp, wp } from "@/helpers/common";
//TODO  import { useTimers } from "@/context/TimerContext";
import { AppSettingsContext } from "@/context/AppSettings";
import AccordionItem from "@/components/AccordionItem";
import RowItem from "@/components/RowItem";
import { useSharedValue } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
// import { usePushNotifications } from "@/hooks/usePushNotification";
// import { colorPalette } from "@/constants";
import {
  DndProvider,
  DndProviderProps,
  Draggable,
  Droppable,
} from "@mgcrea/react-native-dnd";
import type { FunctionComponent } from "react";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";
import { DraggableGridExample } from "@/components/DraggableGridExample";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const Settings = () => {
  const theme = useTheme();
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  const [loopOrPlay, setLoopOrPlay] = useState("loop");

  const { appSettings, setSettings } = useContext(AppSettingsContext);

  if (!appSettings) {
    return <Text>Loading...</Text>; // Fallback while appSettings are loading
  }

  console.log(`existing settings: ${JSON.stringify(appSettings, null, 2)}`);

  //   const { changePresentationStyle, presentationStyle } = useTimers();

  //   const { expoPushToken, notification } = usePushNotifications();
  //   const data = JSON.stringify(notification, null, 2);

  const showNotationAccordion = useSharedValue(false);

  const handleDragEnd: DndProviderProps["onDragEnd"] = ({ active, over }) => {
    "worklet";
    if (over) {
      console.log("onDragEnd", { active, over });
    }
  };

  const handleBegin: DndProviderProps["onBegin"] = () => {
    "worklet";
    console.log("onBegin");
  };

  const handleFinalize: DndProviderProps["onFinalize"] = ({ state }) => {
    "worklet";
    console.log("onFinalize");
    if (state !== State.FAILED) {
      console.log("onFinalize");
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <ScreenWrapper>
      <BottomSheetModalProvider>
        <View style={{ paddingHorizontal: wp(4) }}>
          {/* <UserHeader
                  user={user}
                  router={router}
                  handleLogout={handleLogout}
                /> */}
          {/* DEBUG */}
          {/* <Text>Token: {expoPushToken?.data ?? ""}</Text> */}
          {/* <Text>{data}</Text> */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.secondary,
                },
              ]}
            >
              General
            </Text>

            <View
              style={[
                styles.row,
                { backgroundColor: theme.colors.elevation.level3 },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#FE9400" }]}>
                <IconButton iconColor="#fff" icon="eye" size={20} />
              </View>
              {/* <Text style={styles.rowLabel}>Language</Text> */}
              <Text style={{ color: theme.colors.secondary }}>Sounds on</Text>
              <View style={styles.rowSpacer} />
              <Switch
                style={{ marginRight: 10 }}
                value={appSettings.soundOn} // Default to true if undefined
                onValueChange={(value) => setSettings("soundOn", value)}
              />
            </View>

            {/* /**
          |--------------------------------------------------
          | Notation settings
          |--------------------------------------------------
           */}
            <View
              style={[
                styles.row,
                { backgroundColor: theme.colors.elevation.level3 },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#FE9400" }]}>
                <IconButton iconColor="#fff" icon="pencil" size={20} />
              </View>
              {/* <Text style={styles.rowLabel}>Language</Text> */}
              <Text style={{ color: theme.colors.secondary }}>Notation</Text>
              <View style={styles.rowSpacer} />

              <View style={{ flex: 1.5 }}>
                <SegmentedButtons
                  // style={{ justifyContent: "center", alignItems: "center" }}
                  value={appSettings.notation}
                  onValueChange={(value) => setSettings("notation", value)}
                  buttons={[
                    {
                      value: "default",
                      label: "Transit",
                      icon: () => (
                        <Image
                          source={require("@/assets/images/buttons/MK.png")}
                          style={{ height: 20, resizeMode: "contain" }}
                        />
                      ),
                    },
                    {
                      value: "numpad",
                      label: "1MK",
                    },
                  ]}
                />
              </View>
            </View>

            {/* Straight-shot or Loop */}
            <View
              style={[
                styles.row,
                { backgroundColor: theme.colors.elevation.level3 },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#FE9400" }]}>
                <IconButton iconColor="#fff" icon="eye" size={20} />
              </View>
              {/* <Text style={styles.rowLabel}>Language</Text> */}
              <Text style={{ color: theme.colors.secondary }}>Playback</Text>
              <View style={styles.rowSpacer} />
              {/* <Switch
                style={{ marginRight: 10 }}
                value={appSettings?.loopOrPlayOnce === "loop" ? true : false} // Default to true if undefined
                onValueChange={(value) => setSettings("loopOrPlay", value)} */}
              {/* /> */}

              <View style={{ flex: 1.5 }}>
                <SegmentedButtons
                  value={appSettings.loopOrPlayOnce}
                  onValueChange={(value) =>
                    setSettings("loopOrPlayOnce", value)
                  }
                  buttons={[
                    {
                      value: "loop",
                      label: "Loop",
                      labelStyle: { fontSize: 10 },
                    },
                    {
                      value: "once",
                      label: "Play once",
                      labelStyle: { fontSize: 8 },
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* /**
          |--------------------------------------------------
          | Button mapping
          |--------------------------------------------------
           */}
          <View
            style={[
              styles.row,
              { backgroundColor: theme.colors.elevation.level3 },
            ]}
          >
            <View style={[styles.rowIcon, { backgroundColor: "#FE9400" }]}>
              <IconButton iconColor="#fff" icon="eye" size={20} />
            </View>
            <Text style={{ color: theme.colors.secondary }}>
              Button Mapping
            </Text>
            <View style={styles.rowSpacer} />
            <IconButton icon={"arrow-right"} onPress={onPress} />
          </View>

          {/* <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          /> */}
          {/* <BottomSheetModal
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,

              elevation: 11,
              borderRadius: 50,
            }}
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
          >
            <BottomSheetView
              style={{
                height: 400,
                alignItems: "center",
              }}
            >
              <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: "Football", value: "football" },
                  { label: "Baseball", value: "baseball" },
                  { label: "Hockey", value: "hockey" },
                ]}
              />
            </BottomSheetView>
          </BottomSheetModal> */}

          <AccordionItem isExpanded={open} viewKey="Accordion">
            {/* <RNPickerSelect
              onValueChange={(value) => console.log(value)}
              items={[
                { label: "Football", value: "football" },
                { label: "Baseball", value: "baseball" },
                { label: "Hockey", value: "hockey" },
              ]}
            /> */}
            {/* <DraggableGridExample /> */}
            {/* <View style={styles.exampleBox} /> */}
          </AccordionItem>
        </View>
      </BottomSheetModalProvider>
    </ScreenWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({
  textHeader: { fontSize: 42 },

  container: {
    flex: 1,
    // paddingHorizontal: wp (4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  username: {
    fontSize: hp(3),
    fontWeight: "500",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    // backgroundColor: theme.colors.roseLight,
  },
  horizontalLine: {
    marginVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    borderBottomWidth: 0.3,
    width: wp(50),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    // backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    // color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  section: {
    // paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    // color: '#9e9e9e',
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  box: {
    margin: 24,
    padding: 24,
    height: 128,
    width: 128,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "darkseagreen",
  },
  parent: { width: 200 },
  exampleBox: {
    height: 120,
    width: 120,
    color: "#f8f9ff",
    backgroundColor: "#b58df1",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
