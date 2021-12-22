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
    justifyContent:'center',
    alignItems: "center",
    width: "100%",
  },
});