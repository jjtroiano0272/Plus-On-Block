import {
  View,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { ThemedText } from "@/components/ThemedText";

const CharacterSelect = () => {
  const router = useRouter();

  const onPress = (charSelected: string) => {
    console.log(`charSelected: ${JSON.stringify(charSelected, null, 2)}`);
    router.replace({
      pathname: "/(main)/feed",
      params: {
        charSelected: charSelected,
      },
    });
  };
  return (
    <ScreenWrapper>
      {/* <View style={styles.container}> */}
      {/* {CHARACTER_AVATARS.map((item, index) => (
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
        ))} */}
      {/* </View> */}

      <ThemedText>Who are you playing as?</ThemedText>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        data={CHARACTER_AVATARS}
        ListFooterComponent={
          <Button onPress={() => router.push("/settings")} title="Settings" />
        }
        ListFooterComponentStyle={{
          // flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={({ item, index }) => (
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
        )}
      />
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
