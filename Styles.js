import { StyleSheet } from "react-native";

export const IntroStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  Image: {
    top: -80,
    width: "100%",
    height: "75%",
  },
  Content: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "37%",
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: "space-evenly",
  },
  contentTopText: {
    color: "black",
    fontSize: 38,
  },
  contentCenterText: {
    color: "black",
    fontSize: 16,
    opacity: 0.6,
  },
  contentBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  contentBottomText: {
    color: "black",
    fontSize: 15,
    opacity: 0.6,
    fontWeight: "bold",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#9156EC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
  },
});
export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingTop: 25,
  },
  CountryContainer: {
    width: "90%",
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 250,
    padding: 15,
  },
  CountryDropDownPanel: {
    width: "100%",
  },
  CountriesListContainer: {
    borderRadius: 15,
    elevation: 5,
    paddingVertical: 10,
  },
  Search: { borderRadius: 15, textAlign: "center" },
  CountriesList: {
    borderBottomWidth: 1,
    borderColor: "grey",
    marginHorizontal: "5%",
    padding: 10,
  },
  advice: {
    flexDirection: "row",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-evenly",
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  adviceText: {
    width: 159,
    height: 69,
    marginBottom: 20,
  },
  StatsContainer: {
    width: "90%",
    height: "45%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  StatsRow: {
    flexDirection: "row",
    width: "100%",
    height: "35%",
    justifyContent: "space-between",
  },
  Stats: (bg) => {
    return {
      justifyContent: "space-between",
      width: "47%",
      height: "100%",
      borderRadius: 20,
      backgroundColor: bg,
      padding: 10,
    };
  },
  StatsTextType: (col) => {
    return { fontWeight: "bold", color: col, fontSize: 17 };
  },
  StatsTextFigure: (col) => {
    return {
      fontWeight: "bold",
      color: col,
      fontSize: 25,
      textAlign: "right",
    };
  },
});
export const WorldStyles = StyleSheet.create({
  ScreenType: {
    elevation: 5,
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 250,
    padding: 10,
  },
});
export const CountriesListStyles = StyleSheet.create({
  ScreenType: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  List: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  ListName: {
    flexDirection: "row",
    alignItems: "center",
  },
  ListNameAvi: {
    width: 50,
    height: 50,
    backgroundColor: "grey",
    borderRadius: 50,
    textAlignVertical: "center",
    textAlign: "center",
  },
  Fav: {
    borderColor: "red",
  },
});
