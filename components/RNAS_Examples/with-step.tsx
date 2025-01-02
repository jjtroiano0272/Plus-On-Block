import * as Haptics from "expo-haptics";
import { Slider } from "react-native-awesome-slider";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
// import { Text } from "../../components";
import { COLORS } from "./constants";
import React, { useEffect } from "react";
import { printFrameAdvantage } from "@/helpers/common";
import { ReText } from "react-native-redash";
import { palette } from "@/constants/Colors";

const { width } = Dimensions.get("window");

const colors = [
  "#FF4B4B",
  "#FF764B",
  "#FFA14B",
  "#FFD24B",
  "#FFE74B",
  "#E9FF4B",
  "#BFFF4B",
  "#89FF4B",
  "#4BFF62",
  "#4BFFA1",
];
const step = colors.length - 1;

const TrackSegment = ({
  index,
  progress,
  step,
  color,
}: {
  index: number;
  progress: SharedValue<number>;
  step: number;
  color: string | undefined;
}) => {
  const style = useAnimatedStyle(() => {
    const progressStep = Math.round(progress.value * step);
    return {
      opacity: index < progressStep ? 1 : 0,
    };
  });
  return (
    <View
      style={[
        styles.track,
        {
          borderTopLeftRadius: index === 0 ? 999 : 0,
          borderBottomLeftRadius: index === 0 ? 999 : 0,
          borderTopRightRadius: index === step - 1 ? 999 : 0,
          borderBottomRightRadius: index === step - 1 ? 999 : 0,
          overflow: "hidden",
        },
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFillObject, style]}>
        <View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: color }]}
        />
      </Animated.View>
    </View>
  );
};

const sliderHeight = 8;
const defaultMin = -10;
const defaultMax = 10;

interface DiscreteSliderProps {
  setSelectedNum: (num: number) => void;
}

const DiscreteSlider = ({ setSelectedNum }: DiscreteSliderProps) => {
  const progress = useSharedValue(0);
  const min = useSharedValue(-10);
  const max = useSharedValue(10);

  const bubbleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: progress.value > 0 ? "green" : "red",
    };
  });

  useEffect(() => {
    console.log(
      `bubbleColor.value: ${JSON.stringify(progress.value, null, 2)}`
    );
  }, [progress.value]);

  return (
    <View style={styles.card}>
      {/* <Text tx="Step Slider" h4 style={styles.title} /> */}
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        theme={COLORS.sliderTheme}
        steps={20}
        forceSnapToStep
        bubble={(s) => printFrameAdvantage(s)}
        // containerStyle={{
        //   overflow: "hidden",
        //   borderRadius: 999,
        // }}
        // sliderHeight={sliderHeight}
        // renderBubble={() => (
        //   <Animated.View
        //     style={[
        //       {
        //         borderRadius: 20,
        //         height: 50,
        //         width: 50,
        //       },
        //       bubbleStyle,
        //     ]}
        //   >
        //     <Animated.Text>{progress?.value?.toString()}</Animated.Text>
        //   </Animated.View>
        // )}
        bubbleWidth={50}
        bubbleTranslateY={-50}
        onSlidingComplete={(value) => {
          setSelectedNum(value);
        }}
        bubbleTextStyle={{ color: "white", fontSize: 42 }}
        // renderMark={({ index }) => {
        //   if (index === 0 || index === step) return null;
        //   return (
        //     <View
        //       style={[
        //         styles.mark,
        //         {
        //           backgroundColor: COLORS.markColor,
        //         },
        //       ]}
        //     />
        //   );
        // }}

        renderTrack={({ index }) => {
          return (
            <TrackSegment
              index={index}
              progress={progress}
              step={step}
              //   color={colors[index]}
              color={[palette.plus, palette.negative][index]}
            />
          );
        }}
        hapticMode="step"
        onHapticFeedback={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        thumbWidth={42}
        renderThumb={() => (
          <View
            style={{ borderRadius: 50, borderWidth: 5, height: 42, width: 42 }}
          ></View>
        )}
      />
    </View>
  );
};

export default DiscreteSlider;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    // borderWidth: 1,
    borderColor: "#292929",
    gap: 8,
    // backgroundColor: "#0A0A0A",
  },
  title: {
    marginBottom: 12,
    color: COLORS.textColor,
  },
  slider: {
    width: width * 0.8,
    marginBottom: 20,
    marginTop: 12,
  },
  mark: {
    width: 2,
    height: sliderHeight,
  },
  track: {
    height: "100%",
    width: "100%",
  },
});
