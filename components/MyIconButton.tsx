import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import React, { ComponentProps } from "react";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";

const CONTAINER_PADDING = 5;
const CONTAINER_WIDTH = 34;
const ICON_SIZE = 25;

interface Props {
  iosName: SFSymbol;
  androidName: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  width?: number;
  height?: number;
}
const MyIconButton = ({
  iosName,
  androidName,
  containerStyle,
  onPress,
  width,
  height,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: "#00000050",
          padding: CONTAINER_PADDING,
          borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
          width: CONTAINER_WIDTH,
        },
        containerStyle,
      ]}
    >
      <SymbolView
        name={iosName}
        size={ICON_SIZE}
        style={width && height ? { width, height } : {}}
        tintColor={"white"}
        fallback={
          <Ionicons size={ICON_SIZE} name={androidName} color={"white"} />
        }
      />
    </TouchableOpacity>
  );
};

export default MyIconButton;
