import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles";
import { useFonts } from "../../hooks/useFonts";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      console.log("useFocusEffect called");
      loadScores();
    }, [])
  );

  const loadScores = async () => {
    console.log("loadScores called");
    const l_xp = await AsyncStorage.getItem("userXP");
    const l_best = await AsyncStorage.getItem("bestScore");
    if (l_xp !== null) {
      setUserXP(parseInt(l_xp, 10));
    }
    if (l_best !== null) {
      setBestScore(parseInt(l_best, 10));
    }
  };

  const handleGameEnd = (gameXP) => {
    const n_gameXP = Number(gameXP);
    const newXP = userXP + n_gameXP;
    setUserXP(newXP);
    if (n_gameXP > bestScore) {
      setBestScore(n_gameXP);
    }
    saveScores(newXP, n_gameXP > bestScore ? n_gameXP : bestScore);
  };

  const saveScores = async (newXP, newBestScore) => {
    await AsyncStorage.setItem("userXP", newXP.toString());
    await AsyncStorage.setItem("bestScore", newBestScore.toString());
  };

  useEffect(() => {
    const loadFonts = async () => {
      await useFonts();
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const xp = await AsyncStorage.getItem("userXP");
      const score = await AsyncStorage.getItem("bestScore");
      if (xp !== null) {
        setUserXP(parseInt(xp, 10));
      }
      if (score !== null) {
        setBestScore(parseInt(score, 10));
      }
    };

    fetchData();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={[GlobalStyles.container, { backgroundColor: "#E4D025" }]}>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        {" "}
        <Text style={[GlobalStyles.title, { fontSize: 20 }]}>
          XP: {userXP} Best Score: {bestScore}
        </Text>
      </View>
      <View style={{ marginTop: 60, alignItems: "center" }}>
        <Text style={[GlobalStyles.title, { fontSize: 50 }]}>Learn Math</Text>
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
