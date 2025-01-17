import Constants from "expo-constants";

export const appName =
  Constants.expoConfig?.name.charAt(0).toUpperCase() +
  Constants.expoConfig?.name.slice(1);
