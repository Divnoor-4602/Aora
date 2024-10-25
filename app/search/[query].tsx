import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { searchPosts } from "@/lib/appwrite";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: searchResults, refetch } = useAppwrite(() =>
    searchPosts(query as string)
  );

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary text-white h-full">
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => {
          return (
            <View className="my-6 px-4 space-y-5 mb-12">
              <View className="justify-between items-start flex-row mb-6">
                <View className="">
                  <Text className="font-psemibold text-sm text-gray-100 ">
                    Search Results
                  </Text>
                  <Text className="font-pbold text-2xl text-white">
                    {query}
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

              <SearchInput
                initialQuery={Array.isArray(query) ? query[0] : query}
              />
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
