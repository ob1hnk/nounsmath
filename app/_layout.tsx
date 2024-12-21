import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ArithmeticScreen from "./screens/ArithmeticScreen";
import ComparisonScreen from "./screens/ComparisonScreen";
import InfoScreen from "./screens/InfoScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Arithmetic" component={ArithmeticScreen} />
      <Stack.Screen name="Comparison" component={ComparisonScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  );
}
