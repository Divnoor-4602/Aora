import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import FormField from "./FormField";

interface SearchInputProps {
  value: string;

  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: string;
}

const SearchInput = ({
  value,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}: SearchInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View className="w-full h-16 bg-black-100 rounded-2xl focus:border-secondary  border-black-200 px-4 flex flex-row items-center space-x-2">
      <TextInput
        className="text-base mt-0.5 font-pregular text-white flex-1"
        value={value}
        placeholder={"Search for a video"}
        placeholderTextColor={"#7b7b8b"}
        onChangeText={handleChangeText}
      />

      <TouchableOpacity>
        <Image source={icons.search} className="h-5 w-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
