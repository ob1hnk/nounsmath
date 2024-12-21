import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles";
import { useFonts } from "../../hooks/useFonts";
import AppLoading from "expo-app-loading";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await useFonts();
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={[GlobalStyles.container, { backgroundColor: "#E4D025" }]}>
      <View style={{ marginTop: 100, alignItems: "center" }}>
        <Text style={[GlobalStyles.title, { fontSize: 50 }]}>
          Practice Math
        </Text>
        <Text style={GlobalStyles.title}>with Nouns!</Text>
        <Image
          source={require("../../assets/images/glasses-hip-rose.png")}
          style={[GlobalStyles.image, { margin: 0 }]}
        />
      </View>
      <View style={GlobalStyles.gridContainer}>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => navigation.navigate("Arithmetic")}
        >
          <Image
            source={require("../../assets/images/arithmetic.png")}
            style={GlobalStyles.image}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => navigation.navigate("Comparison")}
        >
          <Image
            source={require("../../assets/images/compare.png")}
            style={[GlobalStyles.image, { width: 180, height: 180 }]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => navigation.navigate("Info")}
        >
          <Text style={[GlobalStyles.title, { fontSize: 20, color: "gray" }]}>
            info
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
