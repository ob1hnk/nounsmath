import React, { useState, useRef, useEffect } from "react";
import { Animated } from "react-native";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  generateComparison,
  evaluateComparison,
  MESSAGES,
  Comparison,
  getRandomMessage,
} from "../features/comparison/logic";
import { GlobalStyles } from "../styles/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ComparisonScreen() {
  const [comparison, setComparison] = useState<Comparison>(
    generateComparison()
  );
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [streakMessage, setStreakMessage] = useState<string>("");
  const streakAnim = useRef(new Animated.Value(0)).current;
  const [timeLeft, setTimeLeft] = useState<number>(150);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(0);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(timerId);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    generateComparison();
    setGameActive(true);
    setTimeLeft(10);
  };

  const endGame = () => {
    setGameActive(false);
    setShowResults(true);
    const xp = calculateXP();
    setEarnedXP(xp);
    saveXP(xp);
  };

  const calculateXP = () => {
    let bonus = 0;
    if (streak % 5 === 0 && streak !== 0) {
      bonus = 5 * streak;
    }
    return correctCount * 10 + bonus;
  };

  const saveXP = async (xp) => {
    try {
      const storedXP = await AsyncStorage.getItem("userXP");

      const currentXP = parseInt(storedXP, 10) || 0;

      const newXP = currentXP + xp;

      await AsyncStorage.setItem("userXP", newXP.toString());

      console.log("XP updated:", newXP);
    } catch (error) {
      console.error("Failed to save XP:", error);
    }
  };

  const handleContinue = () => {
    setShowResults(false);
    setStreak(0);
    setStreakMessage("");
    startGame();
  };

  useEffect(() => {
    if (streak !== 0 && streak % 5 === 0) {
      setStreakMessage(`${streak} in a row!`);

      Animated.sequence([
        Animated.timing(streakAnim, {
          toValue: 1,
          duration: 460,
          useNativeDriver: true,
        }),
        Animated.timing(streakAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(streakAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setStreakMessage(""));
    }
  }, [streak]);

  const handleOperatorSelection = (operator: string) => {
    setSelectedOperator(operator);

    const correct = evaluateComparison(
      comparison.left,
      comparison.right,
      operator
    );
    setIsCorrect(correct);

    if (correct) {
      if (streak !== 0 && streak % 5 === 0) {
        // correct && streak

        setStreak((prevStreak) => prevStreak + 1);
        setCorrectCount((prevCount) => prevCount + 1);
        setTimeout(() => {
          setIsCorrect(null);
          setComparison(generateComparison());
          setSelectedOperator(null);
        }, 1500);
      } else {
        // correct && !streak
        setResultMessage(getRandomMessage(MESSAGES.CORRECT));
        setCorrectCount((prevCount) => prevCount + 1);
        setStreak((prevStreak) => prevStreak + 1);

        setTimeout(() => {
          setIsCorrect(null);
          setSelectedOperator(null);
          setResultMessage("");
          setComparison(generateComparison());
        }, 1500);
      }
    } else {
      // !correct
      setResultMessage(getRandomMessage(MESSAGES.INCORRECT));
      setIncorrectCount((prevCount) => prevCount + 1);
      setStreak(0);

      setTimeout(() => {
        setResultMessage("");
        setIsCorrect(null);
        setSelectedOperator(null);
      }, 1500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F681e6" }]}>
      <View style={GlobalStyles.cor_incor}>
        <Text style={[GlobalStyles.text]}>
          Correct: {correctCount} Incorrect: {incorrectCount}
        </Text>
        <Text style={[GlobalStyles.text, { paddingTop: 5 }]}>
          {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
        </Text>
      </View>
      {!gameActive && !showResults && (
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={[GlobalStyles.title, { textAlign: "center" }]}>
              Let's practice your
            </Text>
            <Text style={[GlobalStyles.title, { textAlign: "center" }]}>
              Numbers Comparison!
            </Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={GlobalStyles.text}>Start</Text>
          </TouchableOpacity>
        </View>
      )}

      {gameActive && (
        <>
          <View style={{ flex: 1, marginTop: 60 }}>
            <Text style={GlobalStyles.title}>Which is bigger?</Text>
          </View>
          <View
            style={{
              flex: 1,
              position: "absolute",
              top: 260,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.numbersContainer}>
              <View style={styles.numberWrapper}>
                <Text style={[GlobalStyles.title, { fontSize: 50 }]}>
                  {comparison.left}
                </Text>
              </View>
              <View style={styles.operatorWrapper}>
                <Text style={[GlobalStyles.title, { fontSize: 50 }]}>
                  {selectedOperator || " "}
                </Text>
              </View>
              <View style={styles.numberWrapper}>
                <Text style={[GlobalStyles.title, { fontSize: 50 }]}>
                  {comparison.right}
                </Text>
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleOperatorSelection(">")}
              >
                <Image
                  source={require("../../assets/images/leftbigger.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleOperatorSelection("=")}
              >
                <Image
                  source={require("../../assets/images/equalduck.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleOperatorSelection("<")}
              >
                <Image
                  source={require("../../assets/images/rightbiggerjigu.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginBottom: 100 }}>
            {streak !== 0 && streak % 5 === 0 ? (
              <Animated.Text
                style={[
                  GlobalStyles.title,
                  {
                    color: "#FFD700", // gold
                    opacity: streakAnim,
                  },
                ]}
              >
                {streakMessage}
              </Animated.Text>
            ) : (
              <Text
                style={[
                  GlobalStyles.title,
                  {
                    color: isCorrect ? "#4bea69" : "#d22209", // correct: green, incorrect: red
                  },
                ]}
              >
                {resultMessage}
              </Text>
            )}
          </View>
        </>
      )}

      {showResults && (
        <View style={styles.results}>
          <View>
            <Text style={GlobalStyles.title}>XP earned</Text>
            <Text style={[GlobalStyles.title, { marginTop: 20 }]}>
              {earnedXP}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleContinue}
            >
              <Text style={GlobalStyles.text}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={GlobalStyles.text}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F681e6",
    justifyContent: "space-around",
    alignItems: "center",
  },
  startButton: {
    width: 200,
    padding: 15,
    backgroundColor: "#2bb26b",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  numbersContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    marginTop: 100,
    marginBottom: 150,
  },
  numberWrapper: {
    width: 100,
    alignItems: "center",
  },
  operatorWrapper: {
    width: 50,
    alignItems: "center",
  },
  number: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  operator: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ff4500",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },

  image: {
    width: 100,
    height: 100,
  },

  results: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  resultsButton: {
    width: 200,
    padding: 15,
    margin: 15,
    backgroundColor: "#2bb26b",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
