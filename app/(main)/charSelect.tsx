import {
  Canvas,
  Blur,
  Image as SkiaImage,
  ColorMatrix,
  useImage,
} from "@shopify/react-native-skia";
import {
  SoftLightBlend,
  Emboss,
  Earlybird,
  Invert,
  RadialGradient,
  Grayscale,
} from "react-native-image-filter-kit";
import {
  View,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import React from "react";
import { CHARACTER_AVATARS } from "@/constants/charAvatars";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { IconButton, useTheme } from "react-native-paper";
import { useAnswers } from "@/context/AnswerContext";
import Picker from "@/components/Picker__Miron/Picker";

const avatarSize = 85;
const CharacterSelect = () => {
  const theme = useTheme();
  const router = useRouter();
  const { setSelectedCharacter } = useAnswers();

  const selectCharacter = (charSelected: string) => {
    router.replace({
      pathname: "/(main)/feed",
      params: {
        charSelected: charSelected,
      },
    });

    setSelectedCharacter(charSelected);
  };

  let debug = false;
  if (debug) {
    return (
      <>
        {/* <IndicatorExample /> */}
        <Picker />
      </>
    );
  }

  return (
    <ScreenWrapper>
      <View
        style={{ justifyContent: "center", alignItems: "center", padding: 12 }}
      >
        <Text style={{ fontSize: 36, color: theme.colors.onBackground }}>
          Who are you playing as?
        </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        numColumns={4}
        data={CHARACTER_AVATARS}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            onPress={() =>
              item.name === "Ryu" ? selectCharacter(item.name) : null
            }
            style={styles.avatarContainer}
          >
            {item.name !== "Ryu" ? (
              <>
                <Image
                  source={item.image}
                  style={[styles.avatar, { tintColor: "#ccc" }]}
                />
                <Image
                  source={item.image}
                  style={[
                    styles.avatar,
                    { position: "absolute", opacity: 0.3 },
                  ]}
                />
              </>
            ) : (
              <Image source={item.image} style={styles.avatar} />
            )}
          </Pressable>
        )}
      />

      <View style={styles.footer}>
        <IconButton
          onPress={() => router.push("/settings")}
          icon="cog-outline"
          size={36}
        />
      </View>
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
    paddingHorizontal: 20,
  },
  footer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: 36, // Add padding to the footer
    paddingHorizontal: 20,
  },
  avatar: {
    height: avatarSize,
    width: avatarSize,
    resizeMode: "cover",
  },
  avatarContainer: {
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 3,
  },
});
