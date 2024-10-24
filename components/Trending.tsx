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

interface Video {
  $id: string;
  title: string;
  thumbnail: string;
  creator: {
    username: string;
    avatar: string;
  };
}

interface TrendingProps {
  posts: Video[];
}

interface TrendingItemProps {
  activeItem: string;
  item: Video;
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
          <Text className="text-white">Playing</Text>
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
      keyExtractor={(item: Video) => item.$id}
      renderItem={({ item }: { item: Video }) => {
        console.log("rendering");
        return <TrendingItem activeItem={activeItem} item={item} />;
      }}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 120, y: 0 }}
      horizontal
    />
  );
};

export default Trending;
