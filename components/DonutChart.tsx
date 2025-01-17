import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PieChartData {
  percent: number;
  color: string;
}

interface PieChartProps {
  size?: number;
  strokeWidth?: number;
}

const generatePieChartData = (): PieChartData[] => {
  // Generate some dummy data for the pie chart
  return [
    { percent: 0.25, color: "red" },
    { percent: 0.25, color: "blue" },
    { percent: 0.25, color: "green" },
    { percent: 0.25, color: "yellow" },
  ];
};

const DonutSegment = ({
  center,
  radius,
  strokeWidth,
  color,
  circumference,
  startAngle,
  endAngle,
}: {
  center: number;
  radius: number;
  strokeWidth: number;
  color: string;
  circumference: number;
  startAngle: number;
  endAngle: number;
}) => {
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = withTiming(
      circumference - (endAngle / 360) * circumference
    );
    return {
      strokeDashoffset,
    };
  });

  return (
    <AnimatedCircle
      cx={center}
      cy={center}
      r={radius}
      strokeWidth={strokeWidth}
      stroke={color}
      strokeDasharray={`${circumference} ${circumference}`}
      originX={center}
      originY={center}
      animatedProps={animatedProps}
    />
  );
};

export const DonutChart = ({ size = 200, strokeWidth = 20 }: PieChartProps) => {
  const [data, setData] = React.useState<PieChartData[]>([]);
  const [startAngles, setStartAngles] = React.useState<number[]>([]);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const refresh = () => {
    const generatedData = generatePieChartData();

    let angle = 0;
    const angles: number[] = [];
    generatedData.forEach((item) => {
      angles.push(angle);
      angle += item.percent * 360;
    });

    setData(generatedData);
    setStartAngles(angles);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {data.map((item, index) => {
          const startAngle = startAngles[index];
          const endAngle = startAngle + item.percent * 360;
          return (
            <DonutSegment
              key={index}
              center={center}
              radius={radius}
              strokeWidth={strokeWidth}
              color={item.color}
              circumference={circumference}
              startAngle={startAngle}
              endAngle={endAngle}
            />
          );
        })}
      </Svg>

      <Button onPress={refresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
