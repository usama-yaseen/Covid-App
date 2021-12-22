import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  ImageBackground,
  View,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import { IntroStyles } from "./Styles";
import { HomeStyles } from "./Styles";

const Intro = ({ navigation }) => {
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
            onPress={() => navigation.navigate("List")}
            color="white"
          />
        </View>
      </View>
      <StatusBar auto />
    </View>
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

const Home = () => {
  return (
    <View style={HomeStyles.container}>
      <Image
        // style={}
        source={require("./assets/HomeDocImg.png")}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            margin: 20,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              width: 179,
              height: 131,
              borderRadius: 20,
              backgroundColor: "#FFE7EC",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontweight: "Bold",
                color: "#FC1441",
                fontSize: 17,
              }}
            >
              Confirmed
            </Text>
            <Text
              style={{
                fontweight: "Bold",
                color: "#FC1441",
                fontSize: 25,
                textAlign: "right",
              }}
            >
              2,37,395
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              width: 179,
              height: 131,
              borderRadius: 20,
              backgroundColor: "rgba(21, 127, 251, 0.1)",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontweight: "Bold",
                color: "rgba(21, 127, 251, 1)",
                fontSize: 17,
              }}
            >
              Active
            </Text>
            <Text
              style={{
                fontweight: "Bold",
                color: "rgba(21, 127, 251, 1)",
                fontSize: 25,
                textAlign: "right",
              }}
            >
              1,17,408
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            margin: 20,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              width: 179,
              height: 131,
              borderRadius: 20,
              backgroundColor: "rgba(48, 166, 74, 0.1)",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontweight: "Bold",
                color: "rgba(48, 166, 74, 1)",
                fontSize: 17,
              }}
            >
              Recovered
            </Text>
            <Text
              style={{
                fontweight: "Bold",
                color: "rgba(48, 166, 74, 1)",
                fontSize: 25,
                textAlign: "right",
              }}
            >
              1,13,325
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              width: 179,
              height: 131,
              borderRadius: 20,
              backgroundColor: "rgba(109, 117, 125, 0.1)",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontweight: "Bold",
                color: "rgba(109, 117, 125, 1)",
                fontSize: 17,
              }}
            >
              Deceased
            </Text>
            <Text
              style={{
                fontweight: "Bold",
                color: "rgba(109, 117, 125, 1)",
                fontSize: 25,
                textAlign: "right",
              }}
            >
              6,650
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Intro" component={Intro} /> */}
        {/* <Stack.Screen name="List" component={List} /> */}
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
      <StatusBar auto />
    </NavigationContainer>
  );
}
