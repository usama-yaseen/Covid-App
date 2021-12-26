import React from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeStyles, WorldStyles } from "../Styles";


export const World = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [WorldData, setWorldData] = React.useState([]);

  React.useEffect(() => {
    retrieveWorldData();
  }, []);

  const retrieveWorldData = async () => {
    try {
      console.log("Retrieving from the Persistant Storage.");
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem("@Covid-App:World-Data");
      if (jsonValue == null) {
        //Data Was Not Found On Persistant Storage
        console.log("Getting Data From API");
        getWorldData();
      } else {
        console.log("Getting Data From Storage");
        setWorldData(JSON.parse(jsonValue));
        setLoading(false);
        console.log("Data Retrieved Successfully!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getWorldData = () => {
    console.log("Getting Data");
    var axios = require("axios").default;

    var options = {
      method: "GET",
      url: "https://covid-19-data.p.rapidapi.com/totals",
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "ea8ebd5fbdmsha04fbb09d733addp17af44jsn4ca2865eaf14",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("Got Data");
        setLoading(false);
        setWorldData(response.data[0]);
        SaveWorldData(response.data[0]);
        console.log(response.data[0]);
      })
      .catch(function (error) {
        console.error("In World Data: " + error);
      });
  };

  const SaveWorldData = async (data) => {
    console.log("Saving");
    await AsyncStorage.setItem("@Covid-App:World-Data", JSON.stringify(data));
    console.log("Saving Done!");
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ fontSize: 32 }}>Loading Data...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      // source={require("./assets/BG.jpg")}
      resizeMode="cover"
      style={HomeStyles.container}
    >
      <View style={WorldStyles.ScreenType}>
        <Text style={{ fontSize: 32, fontStyle: "italic" }}>
          WORLD STATISTICS
        </Text>
      </View>
      <View
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={HomeStyles.advice}
      >
        <Image source={require("../assets/HomeDocImg.png")} />
        <View style={HomeStyles.adviceText}>
          <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 22 }}>
            Know safety tips and precautions from top Doctors.
          </Text>
        </View>
      </View>
      <View style={HomeStyles.StatsContainer}>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("#FFE7EC")}>
            <Text style={HomeStyles.StatsTextType("#FC1441")}>Confirmed</Text>
            <Text style={HomeStyles.StatsTextFigure("#FC1441")}>
              {WorldData.confirmed}
            </Text>
          </View>
          <View style={HomeStyles.Stats("rgba(21, 127, 251, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(21, 127, 251, 1)")}>
              Critical
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(21, 127, 251, 1)")}>
              {WorldData.critical}
            </Text>
          </View>
        </View>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("rgba(48, 166, 74, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(48, 166, 74, 1)")}>
              Recovered
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(48, 166, 74, 1)")}>
              {WorldData.recovered}
            </Text>
          </View>
          <View style={HomeStyles.Stats("rgba(109, 117, 125, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(109, 117, 125, 1)")}>
              Deceased
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(109, 117, 125, 1)")}>
              {WorldData.deaths}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 14, color: "red" }}>
          Last Updated : {WorldData.lastUpdate}
        </Text>
      </View>
    </ImageBackground>
  );
};
