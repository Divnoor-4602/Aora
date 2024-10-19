import { View, Text, StatusBar } from "react-native";

import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-pblack">Aora!</Text>
      <StatusBar />
      <Link href="/(tabs)/home" style={{ color: "blue" }}>
        Go to Home
      </Link>
    </View>
  );
}
