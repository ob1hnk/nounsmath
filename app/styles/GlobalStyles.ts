import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
  },
  title: {
    fontSize: 36,
    fontFamily: "LondrinaSolid-Regular",
    marginBottom: 10,
  },
  text: {
    fontSize: 24,
    fontFamily: "LondrinaSolid-Light",
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    width: 100,
    height: 100,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 200,
    height: 200,
  },
  input: {
    width: 200,
    padding: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#f9f4a5",
    borderRadius: 15,
    fontFamily: "LondrinaSolid-Light",
    textAlign: "left",
    fontSize: 20,
    color: "#1f1d29", // 입력 텍스트 색깔
  },
  cor_incor: {
    paddingTop: 60,
  },
});
