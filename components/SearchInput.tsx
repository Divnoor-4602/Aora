import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { usePathname, router } from "expo-router";

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput = ({ initialQuery }: SearchInputProps) => {
  const pathname = usePathname();

  const [query, setQuery] = useState<string>(initialQuery || "");

  return (
    <View className="w-full h-16 bg-black-100 rounded-2xl focus:border-secondary focus:border border  border-black-200 px-4 flex flex-row items-center space-x-2">
      <TextInput
        className="text-base mt-0.5 font-pregular text-white flex-1"
        value={query}
        placeholder={"Search for a video"}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="h-5 w-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
