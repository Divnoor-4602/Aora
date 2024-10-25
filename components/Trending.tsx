import {
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useState } from "react";

import { icons } from "@/constants";

import { Video, ResizeMode } from "expo-av";

interface VideoItem {
  $id: string;
  title: string;
  video: string;
  thumbnail: string;
  creator: {
    username: string;
    avatar: string;
  };
}

interface TrendingProps {
  posts: VideoItem[];
}

interface TrendingItemProps {
  activeItem: string;
  item: VideoItem;
}

const zoomIn = {
  0: {
    opacity: 1,
    scale: 0.9,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const zoomOut = {
  0: {
    opacity: 1,
    scale: 1,
  },

  1: {
    opacity: 1,
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
  const [play, setPlay] = useState<boolean>(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <>
          <Video
            source={{
              uri: item.video,
            }}
            className="w-48 h-72 rounded-xl mt-3 bg-white/10"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(playbackStatus) => {
              if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            className="relative justify-center items-center "
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={{ uri: item.thumbnail }}
              className="w-48 h-72 rounded-xl my-5 overflow-hidden shadow-lg shadow-black/40"
              resizeMode="cover"
            />

            <Image
              source={icons.play}
              className="absolute w-12 h-12"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: TrendingProps) => {
  const [activeItem, setActiveItem] = useState<string>(posts[1]?.$id);

  const viewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: VideoItem) => item.$id}
      renderItem={({ item }: { item: VideoItem }) => {
        return <TrendingItem activeItem={activeItem} item={item} />;
      }}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 130, y: 0 }}
      horizontal
    />
  );
};

export default Trending;
