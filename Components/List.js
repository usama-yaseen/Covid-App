import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { Icon } from "react-native-elements";
import { CountriesListStyles } from "../Styles";

export const List = ({ navigation, route }) => {
  if (route.params.isLoading) {
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
    <View style={{ marginBottom: "18%" }}>
      <View style={CountriesListStyles.ScreenType}>
        <Text style={{ fontSize: 32, fontStyle: "italic" }}>Countries</Text>
      </View>
      <FlatList
        key={Math.random()}
        refreshing={false}
        onRefresh={() => route.params.retrieveCountries()}
        data={route.params.dataSource}
        //For the warning about virtualized key
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          item.star ? (
            <View style={[CountriesListStyles.List]}>
              <TouchableOpacity
                style={[CountriesListStyles.ListName]}
                activeOpacity={0.5}
                onPress={() => {
                  console.log(JSON.stringify(item));
                  navigation.navigate("Home", {
                    name: item.name,
                    star: item.star,
                    id: item.id,
                    navigated: true,
                  });
                }}
              >
                <Text style={CountriesListStyles.ListNameAvi}>
                  {item.alpha3code}
                </Text>
                <View style={{ paddingLeft: 5 }}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
              <View style={CountriesListStyles.Fav}>
                <Icon
                  name={item.star ? "star" : "star-outline"}
                  type="Ionicons"
                  color={item.star ? "blue" : "black"}
                  size={32}
                  onPress={() => {
                    if (item.star) {
                      route.params.dataSource[index].star = false;
                      route.params.SaveCountriesList(route.params.dataSource);
                    } else {
                      route.params.dataSource[index].star = true;
                      route.params.SaveCountriesList(route.params.dataSource);
                    }
                  }}
                />
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
};
