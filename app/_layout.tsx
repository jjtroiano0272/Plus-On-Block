import { TamaguiProvider, createTamagui } from "@tamagui/core";
// import { config } from "@tamagui/config/v3";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Avatar, IconButton, PaperProvider } from "react-native-paper";
import tamaguiConfig from "@/tamagui.config";
import {
  AppSettingsContext,
  AppSettingsContextProvider,
} from "@/context/AppSettings";
import { AnswerProvider } from "@/context/AnswerContext";
import { Button, View } from "react-native";
import React from "react";
import SpringButton from "@/components/SpringButton";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function _layout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <AppSettingsContextProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AnswerProvider>
              <MainLayout />
            </AnswerProvider>
          </ThemeProvider>
        </AppSettingsContextProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const MainLayout = () => {
  // const { expoPushToken, notification } = usePushNotifications();
  const router = useRouter();
  // const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | number | null>(
    null
  );

  // useEffect(() => {
  //   initI18n().then(() => setIsI18nInitialized(true));
  //   // .then(() => loadDateFnsLocale());
  // }, []);

  useEffect(() => {
    // router.replace("/charSelect");
    router.replace("/ONE_TO_ONE");
  }, []);

  useEffect(() => {
    console.log(`showOnboarding: ${JSON.stringify(showOnboarding, null, 2)}`);
    // if (showOnboarding) router.replace("/onboarding");
  }, [showOnboarding]);

  if (showOnboarding == null) {
    console.log(`Null here....`);
  }

  const { appSettings } = useContext(AppSettingsContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/ONE_TO_ONE"
        options={{
          headerShown: appSettings.headerShown,
          title: "My home",
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // headerLeft: () => (
          //   <SpringButton onPress={() => alert("This is a button!")}>
          //     Info
          //   </SpringButton>
          // ),
        }}
      />
      {/* <Stack.Screen
        name="(main)/DEBUG"
        options={{
          // headerTransparent: true,
          // headerBlurEffect: true,

          headerShown: true,
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTitle: "correct/answered",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => <IconButton icon={"close"} />,
          headerRight: () => (
            <View>
              <Avatar.Image
                size={24}
                source={require("@/assets/images/charAvatars/128px-SF6_Ryu_Icon.png")}
              />
            </View>
          ),
        }}
      /> */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};
