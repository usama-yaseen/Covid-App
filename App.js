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
import { CountriesListStyles, HomeStyles, IntroStyles, WorldStyles } from "./Styles";

var sizeof = require('object-sizeof');

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
const Home = ({ navigation,route }) => {

  console.log("Route Params = " + JSON.stringify(route.params));

  const [isLoading, setLoading] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);
  const [CurrentCountry, setCurrentCountry] = React.useState([]);
  const [Country, setCountry] = useState(null);
  const [navigated, setNavigated] = useState(false);


  React.useEffect(() => {

    console.log("Will TRIGGER NOW \n\n\n\n\n\n\n\n\n\n\n\n\n\n")

    //To Retrieve Current Country Only
    if (route.params.navigated)
      retrieveCountryInfo(route.params.name, false, route.params.star, route.params.id);
    else {
      //To Retrieve Countries
      retrieveCountryInfo(route.params.name, true, route.params.star, route.params.id);
    }
  }, [route.params.name]);

  const retrieveCountryInfo = async (country_name, get_countries, star_value, Country_Number) => {
    try {
      console.log("Retrieving Country from the Persistant Storage.");
      setLoading(true);


      //If We Don't Want the countries than that means we only want to search for some new data
      if (!get_countries) {
        getCountryDataFromAPI(country_name, star_value, Country_Number);
      }
      else {

        //Check In the local storage
        const jsonValue = await AsyncStorage.getItem("@Covid-App:Current-Country");
        if (jsonValue == null) {
          //Data Was Not Found On Persistant Storage
          console.log("Getting Country Data From API");
          getCountryDataFromAPI(country_name, star_value, Country_Number);
        } else {
          console.log("Getting Country Data From Storage");
          setCurrentCountry(JSON.parse(jsonValue));
          console.log("Country Retrieved Successfully!");

          if (get_countries) {
            retrieveCountries();
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCountryDataFromAPI = (name_of_country, star_value, Country_Number) => {

    console.log("In Country API");
    var axios = require("axios").default;

    // var today = new Date();
    // var currentdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate()-1);
    // console.log("CURRENT DATE = " + currentdate);
    //Won't be needed because the api is not generating any reports after 2020-06-16


    var axios = require("axios").default;

    var options = {
      method: 'GET',
      url: 'https://covid-19-data.p.rapidapi.com/report/country/name',
      params: { name: name_of_country, date: "2020-06-16" },
      headers: {
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
        'x-rapidapi-key': 'ea8ebd5fbdmsha04fbb09d733addp17af44jsn4ca2865eaf14'
      }
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("Got Country Data From API");

        let temp = response.data[0];
        temp.star = star_value;
        temp.id = Country_Number;
        setCurrentCountry(temp);
        SaveCountryData(temp);
        console.log(temp);
        navigation.setParams({
          navigated: false,
        });
        route.params.navigated
        retrieveCountries();
      })
      .catch(function (error) {
        console.error("In Country Data: " + error);
      });
  };

  const SaveCountryData = async (data) => {
    console.log("Saving Country");
    await AsyncStorage.setItem("@Covid-App:Current-Country", JSON.stringify(data));
    console.log("Saving Done!");
  };

  const retrieveCountries = async () => {
    try {
      console.log("Retrieving Countries from the Persistant Storage.");
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem("@Covid-App:Countries-List");
      if (jsonValue == null) {
        //Data Was Not Found On Persistant Storage
        console.log("Getting Countries Data From API \n");
        getDatafromAPI();
      } else {
        console.log("Getting CountriesData From Storage");
        setDataSource(JSON.parse(jsonValue));
        console.log("SIZE = " + sizeof(JSON.parse(jsonValue)));
        setLoading(false);
        console.log("Data Retrieved Successfully!");
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
        setLoading(false);

        //Now To Add Star In It
        let temp = response.data.map(x => {
          x.star = false
          return x
        })
        setDataSource(temp);
        SaveCountriesList(temp);
      })
      .catch(function (error) {
        console.error("In Lists : " + error);
      });
  };

  const SaveCountriesList = async (data) => {
    console.log("Saving");
    await AsyncStorage.setItem("@Covid-App:Countries-List", JSON.stringify(data));
    console.log("Saving Done!");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={HomeStyles.CountryContainer}>
        <Dropdown
          data={dataSource}
          placeholder="Select Country"
          value={Country}
          labelField="name"
          valueField="name"
          search
          searchPlaceholder="Search Country"
          onChange={(item) => {
            setCountry(item);
            retrieveCountryInfo(item.name, false, item.star, item.id)
            console.log("selected", item);
          }}
          style={HomeStyles.CountryDropDownPanel}
          containerStyle={HomeStyles.CountriesListContainer}
          inputSearchStyle={HomeStyles.Search}
          maxHeight="50%"
          renderItem={(countries) => {
            return (
              <View style={HomeStyles.CountriesList}>
                <Text>{countries.name}</Text>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 5, marginBottom: 20 }}>
          <Text style={{ fontSize: 32, fontStyle: 'italic' }}>
            {CurrentCountry.provinces[0].province}
          </Text>
          {
            console.log("CurrentCountry = " + JSON.stringify(CurrentCountry))
          }
          <Icon name={CurrentCountry.star ? "star" : 'star-outline'} type='Ionicons' color={CurrentCountry.star ? "blue" : 'black'} size={32}
            onPress={() => {
              if (CurrentCountry.star) {
                dataSource[CurrentCountry.id].star = false
                SaveCountriesList(dataSource);
              }
              else {
                console.log(dataSource[CurrentCountry.id])
                dataSource[CurrentCountry.id].star = true
                SaveCountriesList(dataSource);
                console.log(dataSource[CurrentCountry.id])
              }
            }} />

        </View>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("#FFE7EC")}>
            <Text style={HomeStyles.StatsTextType("#FC1441")}>Confirmed</Text>
            <Text style={HomeStyles.StatsTextFigure("#FC1441")}>{CurrentCountry.provinces[0].confirmed}</Text>
          </View>
          <View style={HomeStyles.Stats("rgba(21, 127, 251, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(21, 127, 251, 1)")}>
              Active
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(21, 127, 251, 1)")}>
              {CurrentCountry.provinces[0].active}
            </Text>
          </View>
        </View>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("rgba(48, 166, 74, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(48, 166, 74, 1)")}>
              Recovered
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(48, 166, 74, 1)")}>
              {CurrentCountry.provinces[0].recovered}
            </Text>
          </View>
          <View style={HomeStyles.Stats("rgba(109, 117, 125, 0.1)")}>
            <Text style={HomeStyles.StatsTextType("rgba(109, 117, 125, 1)")}>
              Deceased
            </Text>
            <Text style={HomeStyles.StatsTextFigure("rgba(109, 117, 125, 1)")}>
              {CurrentCountry.provinces[0].deaths}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
const World = ({ navigation }) => {
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
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
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

const List = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);

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
        setLoading(false);
        console.log("Data Retrieved Successfully!");
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
        setLoading(false);

        //Now To Add Star In It
        let temp = response.data.map((x, index) => {
          x.star = false
          x.id = index;
          return x
        })
        setDataSource(temp);
        SaveCountriesList(temp);
      })
      .catch(function (error) {
        console.error("In Lists : " + error);
      });
  };

  const SaveCountriesList = async (data) => {
    console.log("Saving");
    await AsyncStorage.setItem("@Covid-App:Countries-List", JSON.stringify(data));
    console.log("Saving Done!");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ fontSize: 32 }}>Loading Data...</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: 50 }}>
      <View style={CountriesListStyles.ScreenType}>
        <Text style={{ fontSize: 32, fontStyle: "italic" }}>
          Countries
        </Text>
      </View>
      <FlatList
        key={Math.random()}
        refreshing={false}
        onRefresh={() => retrieveCountries()}
        data={dataSource}
        //For the warning about virtualized key
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          item.star ? (
            <View style={CountriesListStyles.List}>
              <TouchableOpacity style={[CountriesListStyles.ListName]}
                activeOpacity={0.5}
                onPress={() => {
                  console.log(JSON.stringify(item))
                  navigation.navigate("Home", { name: item.name, star: item.star, id: item.id, navigated: true });
                }}>
                <Text style={CountriesListStyles.ListNameAvi}>
                  {item.alpha3code}
                </Text>
                <View style={{ paddingLeft: 5 }}>
                  <Text >{item.name}</Text>
                </View>
              </TouchableOpacity>
              <View style={CountriesListStyles.Fav}>
                <Icon name={item.star ? "star" : 'star-outline'} type='Ionicons' color={item.star ? "blue" : 'black'} size={32}
                  onPress={() => {
                    if (item.star) {
                      dataSource[index].star = false
                      SaveCountriesList(dataSource);
                    }
                    else {
                      dataSource[index].star = true
                      SaveCountriesList(dataSource);
                    }
                  }} />

              </View>
            </View>) : null
        )}
      />
    </View>
  );
};

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [First_time, setFirstTime] = React.useState(true);
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
          initialParams={{ name: "Pakistan", star: false, id: 171, navigated: false }}
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
