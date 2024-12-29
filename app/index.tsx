import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
// @ts-ignore
// import { getItem } from "@/utils/asyncStorage";
import { useTheme } from "react-native-paper";

const index = () => {
  const theme = useTheme();
  const [showOnboarding, setShowOnboarding] = useState<boolean | number | null>(
    null
  );

  // useEffect(() => {
  //   const checkIfAlreadyOnboarded = async () => {
  //     let onboarded = await getItem("onboarded");
  //     setShowOnboarding(onboarded === "1" ? false : true);
  //   };
  //   checkIfAlreadyOnboarded();
  // }, []);

  // if (showOnboarding) {
  //   return <Redirect href="/onboarding" />;
  // }

  return (
    // {/* TODO Change to a really fancy intricate loading spinner */}
    // {/* Shows loading screen by default, otherwise redirects to /home or /welcome */}
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Loading />
    </View>
  );
};

export default index;
