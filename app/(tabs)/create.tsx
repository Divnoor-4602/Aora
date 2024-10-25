import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { Video, ResizeMode } from "expo-av";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import * as ImagePicker from "expo-image-picker";

import { Router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

interface CreatePostProps {
  title: string;
  video: { uri: string; fileName?: string | undefined | null } | null;
  prompt: string;
  thumbnail: { uri: string; fileName?: string | undefined | null } | null;
}

const Create = () => {
  const { user } = useGlobalContext();

  const [createPost, setCreatePost] = useState<CreatePostProps>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,

      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0]);
    }

    if (!result.canceled) {
      if (selectType === "image") {
        setCreatePost({ ...createPost, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setCreatePost({ ...createPost, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (
      !createPost.title ||
      !createPost.video ||
      !createPost.thumbnail ||
      !createPost.prompt
    ) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      await createVideo({
        ...createPost,

        userId: user.$id,
      });
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
      console.log(error);
    } finally {
      setCreatePost({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white font-pbold text-2xl">Upload Video</Text>

        {/* video title */}
        <FormField
          title="Video Title"
          value={createPost.title}
          handleChangeText={(e) => setCreatePost({ ...createPost, title: e })}
          placeholder="Give your video a catchy title..."
          otherStyles={"mt-10"}
          keyboardType={"video title"}
        />

        {/* Upload Video */}
        <View className="mt-7 space-y-2">
          <Text className="font-pmedium text-base text-gray-100">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {createPost.video ? (
              <>
                <Video
                  source={{ uri: createPost.video.uri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                />
              </>
            ) : (
              <>
                <View className="w-full h-40 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Thumbnail upload */}

        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 font-pmedium text-base ">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {createPost.thumbnail ? (
              <>
                <Image
                  source={{ uri: createPost.thumbnail.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              </>
            ) : (
              <>
                <View className="w-full h-20 bg-black-100 rounded-2xl items-center justify-center space-x-2 flex-row">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="font-pmedium text-sm text-gray-100">
                    Choose a file
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* AI prompt */}
        <FormField
          title="AI Prompt"
          value={createPost.prompt}
          handleChangeText={(e) => setCreatePost({ ...createPost, prompt: e })}
          placeholder="The AI prompt of your video..."
          otherStyles={"mt-7"}
          keyboardType={"video title"}
        />

        {/* submit and publish */}

        <CustomButton
          title="Submit & Publish"
          containerStyles="mt-7"
          handlePress={submit}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
