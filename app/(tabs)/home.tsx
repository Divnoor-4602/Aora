import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "@/lib/useAppwrite";
import { getAllPosts, getLatestVideos } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);

  const { data: latestPosts } = useAppwrite(getLatestVideos);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await refetch();

    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary text-white h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => {
          return (
            <View className="my-6 px-4 space-y-5">
              <View className="justify-between items-start flex-row mb-6">
                <View className="">
                  <Text className="font-psemibold text-sm text-gray-100 ">
                    Welcome Back
                  </Text>
                  <Text className="font-pbold text-2xl text-white">
                    Divnoor Singh
                  </Text>
                </View>

                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    className="h-10 w-9"
                    resizeMode="contain"
                  />
                </View>
              </View>

              <SearchInput />

              <View className="w-full flex-1 mb-8">
                <Text className="text-gray-100 font-pregular text-sm mt-5">
                  Trending Videos
                </Text>
                <Trending posts={latestPosts ?? []} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
