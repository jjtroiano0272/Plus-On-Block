import {
  View,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import React from "react";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";

const CharacterSelect = () => {
  const router = useRouter();

  const onPress = (charSelected: string) => {
    console.log(`charSelected: ${JSON.stringify(charSelected, null, 2)}`);
    router.push({
      pathname: "/quiz",
      params: {
        charSelected: charSelected,
      },
    });
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {CHARACTER_AVATARS.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(item.name)}
            style={{
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 3,
            }}
          >
            <Image
              source={item.image}
              style={{ height: 100, width: 100, resizeMode: "cover" }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Button onPress={() => router.push("/settings")} title="Settings" />
    </ScreenWrapper>
  );
};

export default CharacterSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
