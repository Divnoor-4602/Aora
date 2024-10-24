import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";

interface VideoCardProps {
  video: {
    title: string;
    thumbnail: string;
    creator: {
      username: string;
      avatar: string;
    };
  };
}

const VideoCard = ({
  video: {
    title,
    thumbnail,
    creator: { username, avatar },
  },
}: VideoCardProps) => {
  const [play, setPlay] = useState<boolean>(false);

  return (
    <View className="flex-col px-4 items-center mb-14 w-full">
      <View className="flex-row justify-between items-center w-full">
        <View className="flex-row gap-2">
          <Image
            resizeMode="contain"
            source={{ uri: avatar }}
            className="w-10 h-10 rounded-lg border-2 border-secondary"
          />
          <View className="flex-col">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 text-xs font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <Image resizeMode="contain" source={icons.menu} className="w-4 h-5" />
      </View>

      {play ? (
        <Text>Playing</Text>
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
