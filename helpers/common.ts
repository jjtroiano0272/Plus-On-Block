import { palette } from "@/constants/Colors";
import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percentage: number) => {
  return (percentage * deviceHeight) / 100;
};

export const wp = (percentage: number) => {
  return (percentage * deviceWidth) / 100;
};

export const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const destringifyArray = (stringifiedArr: string): string[] | null => {
  if (!stringifiedArr) {
    console.log("Error in array");
    return null;
  }

  return stringifiedArr.replace(/[ \[\] "]/g, "").split(",");
};

/** Transform the file arrray into the right shape which has the correct fields that Slider can use. */
export const toSliderItemList = (data: any) => {
  if (!data || !Array.isArray(data)) return null;
  console.log("\x1b[36m" + `data: ${JSON.stringify(data, null, 2)}`);

  return data?.map((item) => ({
    title: item.assetId,
    image: { uri: item.uri },
    description: item.fileName,
  }));
};

export const parseTime = (time: number) => {
  if (time === 0) return;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  console.log(
    `{minutes, seconds}: ${JSON.stringify({ minutes, seconds }, null, 2)}`
  );

  return minutes ? `${minutes}m, ${seconds}s` : `${seconds} seconds`;
};

export const getImagePath = (path: string) => {
  console.log(`path: ${JSON.stringify(path, null, 2)}`);

  if (!path) {
    console.error(`No path passed for image!`);
    return;
  }

  let res;
  if (path?.startsWith("http")) {
    res = { uri: path };
  } else if (path) {
    // res = require(path);
    console.log(`@path: ${JSON.stringify(path, null, 2)}`);
  }

  return res;
};

export const printFrameAdvantage = (num: number): string =>
  num >= 0 ? `+${num}` : num.toString();

export const hitSlop30 = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
};

export const shuffleArray = (array: any[]) => {
  let shuffledArray = array.slice(); // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

export const buttonIcons: { move: string; image: string }[] = [
  { move: "LP", image: require("@/assets/images/buttons/LP.png") },
  { move: "MP", image: require("@/assets/images/buttons/MP.png") },
  { move: "HP", image: require("@/assets/images/buttons/HP.png") },
  { move: "LK", image: require("@/assets/images/buttons/LK.png") },
  { move: "MK", image: require("@/assets/images/buttons/MK.png") },
  { move: "HK", image: require("@/assets/images/buttons/HK.png") },
  // combos
  { move: "HP+HK", image: require("@/assets/images/buttons/HP.png") },
  { move: "MP+MK", image: require("@/assets/images/buttons/HP.png") },
];

export const getBackgroundColor = (i, tenth) => {
  if (i < 0 && !tenth) return palette.plus;
  if (i < 0 && tenth) return "#FA9F9F";
  // if (tenth) return "#333";

  if (i > 0 && !tenth) return palette.negative;
  if (i > 0 && tenth) return "#035E00";
  // return "#999";
  if (i === 0) return "#999";
};

export const getItemColor = (item: string) => {
  if (item.includes("-")) {
    return palette.plus;
  } else if (item.includes("+0")) {
    return "#ccc"; // #999
  } else {
    return palette.negative;
  }
};

export const defaultVideoUri =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const MY_SECTIONS = [
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

export const DEBUG_DATA = [
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

export const rulerTickMarks = [...Array(20 + 1).keys()].map((i) => i + -10);
