import { Text, ScrollView, View, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import React from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Welcome() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    console.log("Redirecting to /home");
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex flex-col items-center px-4 h-[85vh]">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[375px] max-h-[298px]"
          />
          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-center text-white">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              className="absolute w-[80px] h-[15px] -bottom-2 -right-2"
            />
          </View>
          <Text className="text-gray-100 text-center mt-7 text-sm font-pregular">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles={"w-full mt-7"}
          />
        </View>
      </ScrollView>
      {/* status bar */}
      <StatusBar barStyle={"light-content"} backgroundColor={"#161622"} />
    </SafeAreaView>
  );
}
