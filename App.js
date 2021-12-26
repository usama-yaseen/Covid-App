import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Intro } from "./Components/Intro";
import { World } from "./Components/World";
import { List } from "./Components/List";
import { Home } from "./Components/Home";

var sizeof = require("object-sizeof");


const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [First_time, setFirstTime] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    retrieveCountries();
  }, []);

  const retrieveCountries = async () => {
    try {
      console.log("Retrieving from the Persistant Storage.");
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem("@Covid-App:Countries-List");
      if (jsonValue == null) {
        //Data Was Not Found On Persistant Storage
        console.log("Getting Data From API");
        getDatafromAPI();
      } else {
        console.log("Getting Data From Storage");
        setDataSource(JSON.parse(jsonValue));
        console.log("SIZE = " + sizeof(JSON.parse(jsonValue)));
        console.log("Data Retrieved Successfully!");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDatafromAPI = () => {
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
        console.log("Got Data");

        //Now To Add Star In It
        let temp = response.data.map((x, index) => {
          x.star = false;
          x.id = index;
          return x;
        });
        setDataSource(temp);
        SaveCountriesList(temp);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("In Lists : " + error);
      });
  };

  const SaveCountriesList = async (data) => {
    console.log("Saving");
    await AsyncStorage.setItem(
      "@Covid-App:Countries-List",
      JSON.stringify(data)
    );
    console.log("Saving Done!");
  };

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
          initialParams={{
            name: "Pakistan",
            star: false,
            id: 171,
            dataSource: dataSource,
            isLoading: isLoading,
            navigated: false,
            setLoading: setLoading,
            retrieveCountries: retrieveCountries,
            SaveCountriesList: SaveCountriesList,
          }}
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
          initialParams={{
            dataSource: dataSource,
            isLoading: isLoading,
            retrieveCountries: retrieveCountries,
            SaveCountriesList: SaveCountriesList,
          }}
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
