import { AppSettingsContext } from "@/context/AppSettings";
import { wp } from "@/helpers/common";
import {
  DndProvider,
  type ObjectWithId,
  Draggable,
  DraggableGrid,
  DraggableGridProps,
} from "@mgcrea/react-native-dnd";
import React, { useContext } from "react";
import { type FunctionComponent } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const GRID_SIZE = 3;

export const DraggableGridExample: FunctionComponent = () => {
  const { appSettings, setSettings } = useContext(AppSettingsContext);
  // const items: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const items: { move: string; image: string }[] = [
    { move: "LP", image: require("@/assets/images/buttons/LP.png") },
    { move: "MP", image: require("@/assets/images/buttons/MP.png") },
    { move: "HP", image: require("@/assets/images/buttons/HP.png") },
    { move: "LK", image: require("@/assets/images/buttons/LK.png") },
    { move: "MK", image: require("@/assets/images/buttons/MK.png") },
    { move: "HK", image: require("@/assets/images/buttons/HK.png") },
    { move: "HP+HK", image: require("@/assets/images/buttons/HP.png") },
    { move: "MP+MK", image: require("@/assets/images/buttons/HP.png") },
  ];

  const numPadNotation = [
    { move: "5LP" },
    { move: "5MP" },
    { move: "5HP" },
    { move: "5LK" },
    { move: "5MK" },
    { move: "5HK" },
    { move: "5HP+5HK" },
    { move: "5MP+5MK" },
  ];
  // const data = items.map((image, index) => ({
  //   id: `${index}-${image}`,
  //   image: image,
  // })) satisfies ObjectWithId[];

  const onGridOrderChange: DraggableGridProps["onOrderChange"] = (value) => {
    console.log("onGridOrderChange", value);
  };

  return (
    <DndProvider>
      <DraggableGrid
        direction="row"
        size={GRID_SIZE}
        style={styles.grid}
        onOrderChange={onGridOrderChange}
      >
        {items.map((item) => (
          <Draggable key={item.move} id={item.move} style={styles.draggable}>
            <Image
              source={item?.image}
              style={{ height: "100%", resizeMode: "contain" }}
            />
          </Draggable>
        ))}
      </DraggableGrid>
    </DndProvider>
  );
};

const LETTER_WIDTH = 80;
const LETTER_HEIGHT = 80;
const LETTER_GAP = 10;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  grid: {
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "flex-start",
    width: LETTER_WIDTH * GRID_SIZE + LETTER_GAP * (GRID_SIZE - 1),
    gap: LETTER_GAP,
    borderRadius: 32,
    paddingHorizontal: wp(4),
  },
  title: {
    color: "#555",
    textTransform: "uppercase",
    fontWeight: "bold",
    position: "absolute",
    top: 10,
    left: 10,
  },
  draggable: {
    backgroundColor: "seagreen",
    width: LETTER_WIDTH,
    height: LETTER_HEIGHT,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },
});
