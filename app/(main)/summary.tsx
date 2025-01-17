import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useRouter } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAnswers } from "@/context/AnswerContext";
import ReanimatedGraph, {
  ReanimatedGraphPublicMethods,
} from "@birdwingo/react-native-reanimated-graph";

import {
  BarChart,
  LineChart,
  PieChart,
  PieChartPro,
  PopulationPyramid,
  RadarChart,
} from "react-native-gifted-charts";
import { Pie, PolarChart } from "victory-native";
import { palette } from "@/constants/Colors";
import { DonutChart } from "@/components/DonutChart";

const Summary = () => {
  const router = useRouter();
  const theme = useTheme();
  const { numAnswered, numCorrect, setNumAnswered, setNumCorrect } =
    useAnswers();
  const data = [
    {
      value: numCorrect,
      color: palette.orangePeel,
      text: numCorrect.toString(),
    },
    {
      value: numAnswered,
      color: palette.lapisLazuli,
      text: numCorrect.toString(),
    },
  ];

  const goHome = () => {
    setNumAnswered(0);
    setNumCorrect(0);
    router.replace("/(main)/charSelect");
  };

  return (
    <ScreenWrapper style={{ paddingHorizontal: 20 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 42, color: theme.colors.onBackground }}>
          Summary
        </Text>
      </View>

      {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> */}
      {/* <PieChartPro data={data} donut isAnimated={true} textColor="white" /> */}

      {/* <DonutChart /> */}
      {/* </View> */}

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
          You answered {numAnswered}, got {numCorrect} correct!
        </Text>
      </View>

      {/* TODO High score */}
      {/* TODO Longst streak */}
      {/* TODO Which moves do you often get wrong? */}

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 40,
        }}
      >
        <IconButton icon="home" onPress={goHome} size={42} />
      </View>
    </ScreenWrapper>
  );
};

export default Summary;
