import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-elements";
import { IntroStyles } from "../Styles";

export const Intro = (props) => {
  return (
    <View style={IntroStyles.container}>
      <Image
        style={IntroStyles.Image}
        source={require("../assets/BG_Illustration.png")}
      />
      <View style={IntroStyles.Content}>
        <Text style={IntroStyles.contentTopText}>
          Be aware{"\n"}
          Stay Healthy
        </Text>
        <Text style={IntroStyles.contentCenterText}>
          Welcome to COVID-19 information portal.
        </Text>
        <View style={IntroStyles.contentBottom}>
          <Text style={IntroStyles.contentBottomText}>GET STARTED</Text>
          <Icon
            name="arrow-right"
            type="font-awesome"
            containerStyle={IntroStyles.icon}
            activeOpacity={0.6}
            onPress={() => props.setFirstTime(false)}
            color="white"
          />
        </View>
      </View>
      <StatusBar auto />
    </View>
  );
};
