import { Text, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface SliderCardProps {
  title: string;
  children: ReactNode;
  style?: ViewStyle;
}

export function SliderCard({ title, children, style }: SliderCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#292929",
    gap: 8,
    backgroundColor: "#0a0a0a",
  },
  title: {
    marginBottom: 12,
    color: "#EAECEF",
    fontSize: 24,
  },
});
