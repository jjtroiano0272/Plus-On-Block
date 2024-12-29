import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Icon, IconButton, Switch, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ExpoRouter } from "expo-router";
import AccordionItem from "./AccordionItem";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
// import { Theme } from "react-native-paper";

interface Props {
  title: string;
  onPress?: () => void; // ?
  icon?: string | IconSource | React.ReactNode | undefined;
  iconBgColor?: string;
  iconColor?: string;
  open?: SharedValue<boolean>;
  duration?: number;
  children?: ReactNode;
}

const RowItem = ({
  title,
  onPress,
  icon,
  iconBgColor,
  iconColor,
  open,
  duration = 500,
  children,
}: Props) => {
  const theme = useTheme();
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(open?.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, { backgroundColor: theme.colors.elevation.level3 }]}
    >
      {icon && (
        <View
          style={[
            styles.rowIcon,
            { backgroundColor: iconBgColor || theme.colors.error },
          ]}
        >
          <IconButton
            iconColor={iconColor || "#fff"}
            icon={icon || "account"}
            size={20}
          />
        </View>
      )}
      <Text
        style={[
          styles.rowLabel,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.rowSpacer} />

      <Icon color={theme.colors.secondary} source="chevron-right" size={20} />

      <Animated.View
        key={`accordionItem_${viewKey}`}
        style={[styles.animatedView, bodyStyle, style]}
      >
        <View
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
          }}
          style={styles.wrapper}
        >
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RowItem;

const styles = StyleSheet.create({
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
});
