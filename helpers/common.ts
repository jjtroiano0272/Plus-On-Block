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
