import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  generateQuestion,
  checkAnswer,
  MESSAGES,
  Question,
  getRandomMessage,
} from "../features/arithmetic/logic";
import { GlobalStyles } from "../styles/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ArithmeticScreen({ navigation }) {
  const [question, setQuestion] = useState<Question>(generateQuestion());
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(150);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;

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
    setQuestion(generateQuestion());
    setGameActive(true);
    setTimeLeft(150);
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
      const storedBestScore = await AsyncStorage.getItem("bestScore");

      const currentXP = parseInt(storedXP, 10) || 0;
      const currentBestScore = parseInt(storedBestScore, 10) || 0;

      const newXP = currentXP + xp;

      const newBestScore = Math.max(currentBestScore, xp);

      await AsyncStorage.setItem("userXP", newXP.toString());
      await AsyncStorage.setItem("bestScore", newBestScore.toString());

      console.log("XP and best score updated:", newXP, newBestScore);
    } catch (error) {
      console.error("Failed to save XP or best score:", error);
    }
  };

  const handleContinue = () => {
    setShowResults(false);
    setUserAnswer("");
    setStreak(0);
    startGame();
  };

  const handleCheckAnswer = () => {
    if (userAnswer.trim() === "") {
      setResultMessage("Type your answer!");
      setIsCorrect(null);
      setUserAnswer("");
      return;
    }

    const correct = checkAnswer(Number(userAnswer), question.answer);
    setIsCorrect(correct);
    setResultMessage(
      correct
        ? getRandomMessage(MESSAGES.CORRECT)
        : getRandomMessage(MESSAGES.INCORRECT)
    );

    setUserAnswer("");

    if (correct) {
      setCorrectCount((prevCount) => prevCount + 1);
      setQuestion(generateQuestion());
      setStreak((prevStreak) => prevStreak + 1);
    } else {
      setIncorrectCount((prevCount) => prevCount + 1);
      setStreak(0);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[GlobalStyles.container, { backgroundColor: "#63A0F9" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={GlobalStyles.cor_incor}>
            <Text style={[GlobalStyles.text]}>
              Correct: {correctCount} Incorrect: {incorrectCount}
            </Text>
            <Text style={[GlobalStyles.text, { paddingTop: 20 }]}>
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
              <Text style={[GlobalStyles.title, { textAlign: "center" }]}>
                Let's test your Arithmetics!
              </Text>
              <TouchableOpacity style={styles.button} onPress={startGame}>
                <Text style={GlobalStyles.text}>Start</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameActive && (
            <>
              <Animated.Text
                style={[
                  GlobalStyles.title,
                  {
                    position: "absolute",
                    top: 100,
                    flex: 0.5,
                    marginTop: 10,
                    color: "#FFF006",
                    opacity: fadeAnim,
                  },
                ]}
              >
                Type your answer
              </Animated.Text>
              <View
                style={{ flex: 1.7, justifyContent: "center", marginTop: 60 }}
              >
                <Text
                  style={[
                    GlobalStyles.title,
                    { color: "#F5FCFF", fontSize: 50 },
                  ]}
                >
                  {question.operand1} {question.operator} {question.operand2} =
                  ?
                </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <View style={{ height: 40, justifyContent: "center" }}>
                  {resultMessage && (
                    <Text
                      style={[
                        GlobalStyles.title,
                        {
                          fontSize: 26,
                          color: isCorrect ? "#4bea69" : "#d22209",
                        },
                      ]}
                    >
                      {resultMessage}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={GlobalStyles.input}
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  keyboardType="numeric"
                  placeholder="type here"
                  placeholderTextColor="#f9f4a5"
                />
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={handleCheckAnswer}
                >
                  <Text style={[GlobalStyles.text, { color: "#f5fcff" }]}>
                    Next
                  </Text>
                </TouchableOpacity>
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
                  style={styles.resultsButton}
                  onPress={handleContinue}
                >
                  <Text style={GlobalStyles.text}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resultsButton}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={GlobalStyles.text}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  button: {
    width: 200,
    padding: 15,
    backgroundColor: "#2bb26b",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
