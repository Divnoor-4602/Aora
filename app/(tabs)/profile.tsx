import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";

import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";

import VideoCard from "@/components/VideoCard";
import useAppwrite from "@/lib/useAppwrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: userPosts, refetch } = useAppwrite(() =>
    getUserPosts(user.$id)
  );

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);

    refetch();

    setRefreshing(false);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary text-white h-full">
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => {
          return (
            <>
              <View className="my-2 px-4">
                <TouchableOpacity className="self-end" onPress={() => logout()}>
                  <Image
                    source={icons.logout}
                    className="h-6 w-6"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <View className="flex flex-col items-center">
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-14 h-14 rounded-xl border-2 border-secondary"
                    resizeMode="contain"
                  />
                  <Text className="font-pbold text-lg mt-3 text-white">
                    {user.username}
                  </Text>
                </View>

                <View className="mt-5 flex-row justify-center mb-7">
                  <InfoBox
                    title={userPosts.length || 0}
                    subtitle="Posts"
                    containerStyles="mr-10"
                    titleStyles="text-xl"
                  />

                  <InfoBox
                    title={"1.2K"}
                    subtitle="Posts"
                    containerStyles=""
                    titleStyles="text-xl"
                  />
                </View>
              </View>
            </>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Upload your first video to get started"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
