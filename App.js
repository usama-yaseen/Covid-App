import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { IntroStyles } from "./Styles";
import { HomeStyles } from "./Styles";

const Intro = (props) => {
  return (
    <View style={IntroStyles.container}>
      <Image
        style={IntroStyles.Image}
        source={require("./assets/BG_Illustration.png")}
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
const Home = () => {
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];
  const [Country, setCountry] = useState(null);

  return (
    <ImageBackground
      // source={require("./assets/BG.jpg")}
      resizeMode="cover"
      style={HomeStyles.container}
    >
      <View style={HomeStyles.CountryContainer}>
        <Dropdown
          data={data}
          placeholder="Select Country"
          value={Country}
          labelField="label"
          valueField="value"
          search
          searchPlaceholder="Search Country"
          onChange={(item) => {
            setCountry(item.value);
            console.log("selected", item);
          }}
          style={HomeStyles.CountryDropDownPanel}
          containerStyle={HomeStyles.CountriesListContainer}
          inputSearchStyle={{ borderRadius: 15 }}
          maxHeight="50%"
          renderItem={(countries) => {
            return (
              <View style={HomeStyles.CountriesList}>
                <Text>{countries.label}</Text>
              </View>
            );
          }}
        />
      </View>
      <View style={HomeStyles.advice}>
        <Image source={require("./assets/HomeDocImg.png")} />
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
            <Text style={HomeStyles.StatsTextFigure("#FC1441")}>2,37,395</Text>
          </View>
          <View style={HomeStyles.Stats("rgba(21, 127, 251, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(21, 127, 251, 1)")}>
              Active
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(21, 127, 251, 1)")}>
              1,17,408
            </Text>
          </View>
        </View>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("rgba(48, 166, 74, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(48, 166, 74, 1)")}>
              Recovered
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(48, 166, 74, 1)")}>
              1,13,325
            </Text>
          </View>
          <View style={HomeStyles.Stats("rgba(109, 117, 125, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(109, 117, 125, 1)")}>
              Deceased
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(109, 117, 125, 1)")}>
              6,650
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
const World = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);

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
        setDataSource(JSON.parse(jsonValue));
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
        setDataSource(response.data[0]);
        SaveWorldData(response.data[0]);
        console.log(response.data[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const SaveWorldData = async (data) => {
    console.log("Saving");
    await AsyncStorage.setItem("@Covid-App:World-Data", JSON.stringify(data));
    console.log("Saving Done!");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading Data from JSON Placeholder API ...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      // source={require("./assets/BG.jpg")}
      resizeMode="cover"
      style={HomeStyles.container}
    >
      <View style={HomeStyles.ScreenType}>
        <Text style={{ fontSize: 32, fontStyle: "italic" }}>
          WORLD STATISTICS
        </Text>
      </View>
      <View style={HomeStyles.advice}>
        <Image source={require("./assets/HomeDocImg.png")} />
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
              {dataSource.confirmed}
            </Text>
          </View>
          <View style={HomeStyles.Stats("rgba(21, 127, 251, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(21, 127, 251, 1)")}>
              Critical
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(21, 127, 251, 1)")}>
              {dataSource.critical}
            </Text>
          </View>
        </View>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("rgba(48, 166, 74, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(48, 166, 74, 1)")}>
              Recovered
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(48, 166, 74, 1)")}>
              {dataSource.recovered}
            </Text>
          </View>
          <View style={HomeStyles.Stats("rgba(109, 117, 125, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(109, 117, 125, 1)")}>
              Deceased
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(109, 117, 125, 1)")}>
              {dataSource.deaths}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 14, color: "red" }}>
          Last Updated : {dataSource.lastUpdate}
        </Text>
      </View>
    </ImageBackground>
  );
};
const List = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    var axios = require("axios").default;
    var options = {
      method: "GET",
      url: "https://covid-19-data.p.rapidapi.com/help/countries",
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "ea8ebd5fbdmsha04fbb09d733addp17af44jsn4ca2865eaf14",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setLoading(false);
        setDataSource(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading Data from JSON Placeholder API ...</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: 50 }}>
      <FlatList
        refreshing={false}
        onRefresh={() => Alert.alert("Refreshing")}
        data={dataSource}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.5}>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                borderBottomWidth: 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "grey",
                  borderRadius: 50,
                  textAlignVertical: "center",
                  textAlign: "center",
                }}
              >
                {item.alpha3code}
              </Text>
              <View style={{ paddingLeft: 5, paddingRight: 10 }}>
                <Text>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [First_time, setFirstTime] = React.useState(false);
  return First_time ? (
    <Intro setFirstTime={setFirstTime} />
  ) : (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        labeled={false}
        activeColor="blue"
        inactiveColor="black"
        barStyle={{ backgroundColor: "white" }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="World"
          component={World}
          options={{
            tabBarLabel: "World",
            tabBarIcon: ({ color }) => (
              <Icon name="public" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={List}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused, color }) => (
              <Icon name="book" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
