import * as Font from "expo-font";

export const useFonts = async () => {
  await Font.loadAsync({
    "LondrinaSolid-Thin": require("../assets/fonts/LondrinaSolid-Thin.ttf"),
    "LondrinaSolid-Light": require("../assets/fonts/LondrinaSolid-Light.ttf"),
    "LondrinaSolid-Regular": require("../assets/fonts/LondrinaSolid-Regular.ttf"),
    "LondrinaSolid-Black": require("../assets/fonts/LondrinaSolid-Black.ttf"),
  });
};
