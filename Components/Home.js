import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { Icon } from "react-native-elements";
import { HomeStyles } from "../Styles";

export const Home = ({ navigation, route }) => {
  const [Country, setCountry] = useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [CurrentCountry, setCurrentCountry] = React.useState([]);

  React.useEffect(() => {
    console.log("Will TRIGGER NOW \n\n\n\n\n\n\n\n\n\n\n\n\n\n");

    if (route.params.navigated) {
      retrieveCountryInfo(
        true,
        route.params.name,
        route.params.star,
        route.params.id
      );
    } else {
      retrieveCountryInfo(
        false,
        route.params.name,
        route.params.star,
        route.params.id
      );
    }
  }, [route.params.name]);

  const retrieveCountryInfo = async (
    new_info,
    country_name,
    star_value,
    Country_Number
  ) => {
    if (new_info) {
      getCountryDataFromAPI(country_name, star_value, Country_Number);
    } else {
      try {
        console.log("Retrieving Country from the Persistant Storage.");
        setLoading(true);
        //Check In the local storage
        const jsonValue = await AsyncStorage.getItem(
          "@Covid-App:Current-Country"
        );
        if (jsonValue == null) {
          //Data Was Not Found On Persistant Storage
          console.log("Getting Country Data From API");
          getCountryDataFromAPI(country_name, star_value, Country_Number);
        } else {
          console.log("Getting Country Data From Storage");
          console.log("Country Retrieved From Data Storage : " + jsonValue);
          setCurrentCountry(JSON.parse(jsonValue));
          console.log("Country Retrieved Successfully!");
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getCountryDataFromAPI = (
    name_of_country,
    star_value,
    Country_Number
  ) => {
    console.log("In Country API");
    var axios = require("axios").default;
    setLoading(true);

    // var today = new Date();
    // var currentdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate()-1);
    // console.log("CURRENT DATE = " + currentdate);
    //Won't be needed because the api is not generating any reports after 2020-06-16

    var axios = require("axios").default;

    var options = {
      method: "GET",
      url: "https://covid-19-data.p.rapidapi.com/report/country/name",
      params: { name: name_of_country, date: "2020-06-16" },
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "ea8ebd5fbdmsha04fbb09d733addp17af44jsn4ca2865eaf14",
      },
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
        console.log(route.params.navigated);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("In Country Data: " + error);
      });
  };

  const SaveCountryData = async (data) => {
    console.log("Saving Country");
    await AsyncStorage.setItem(
      "@Covid-App:Current-Country",
      JSON.stringify(data)
    );
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
      <View style={HomeStyles.CountryContainer}>
        <Dropdown
          data={route.params.dataSource}
          placeholder="Select Country"
          value={Country}
          labelField="name"
          valueField="name"
          search
          searchPlaceholder="Search Country"
          onChange={(item) => {
            setCountry(item);
            retrieveCountryInfo(true, item.name, item.star, item.id);
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
        <Image source={require("../assets/HomeDocImg.png")} />
        <View style={HomeStyles.adviceText}>
          <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 22 }}>
            Know safety tips and precautions from top Doctors.
          </Text>
        </View>
      </View>

      <View style={HomeStyles.StatsContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            paddingBottom: 5,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 32, fontStyle: "italic" }}>
            {CurrentCountry.provinces[0].province}
          </Text>
          {console.log("CurrentCountry = " + JSON.stringify(CurrentCountry))}
          <Icon
            name={CurrentCountry.star ? "star" : "star-outline"}
            type="Ionicons"
            color={CurrentCountry.star ? "blue" : "black"}
            size={32}
            onPress={() => {
              if (CurrentCountry.star) {
                setCountry(CurrentCountry);
                route.params.dataSource[CurrentCountry.id].star = false;
                route.params.SaveCountriesList(route.params.dataSource);
              } else {
                console.log(route.params.dataSource[CurrentCountry.id]);
                route.params.dataSource[CurrentCountry.id].star = true;
                route.params.SaveCountriesList(route.params.dataSource);
                console.log(route.params.dataSource[CurrentCountry.id]);
              }
            }}
          />
        </View>
        <View style={HomeStyles.StatsRow}>
          <View style={HomeStyles.Stats("#FFE7EC")}>
            <Text style={HomeStyles.StatsTextType("#FC1441")}>Confirmed</Text>
            <Text style={HomeStyles.StatsTextFigure("#FC1441")}>
              {CurrentCountry.provinces[0].confirmed}
            </Text>
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
