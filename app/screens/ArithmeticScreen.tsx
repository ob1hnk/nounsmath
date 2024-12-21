import React, { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";
import {
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

export default function ArithmeticScreen() {
  const [question, setQuestion] = useState<Question>(generateQuestion());
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // isCorrect 상태 추가
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [streakMessage, setStreakMessage] = useState<string>("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (streak !== 0 && streak % 5 === 0) {
      setStreakMessage(`${streak} in a row!`);

      Animated.sequence([
        Animated.timing(streakAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(streakAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setStreakMessage(""));
    }
  }, [streak]);

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
          </View>
          {streakMessage ? (
            <Animated.Text
              style={[
                GlobalStyles.title,
                {
                  position: "absolute",
                  top: 100,
                  flex: 0.5,
                  marginTop: 10,
                  color: "#FFD700", // gold
                  opacity: streakAnim,
                },
              ]}
            >
              {streakMessage}
            </Animated.Text>
          ) : null}
          <Animated.Text
            style={[
              GlobalStyles.title,
              {
                position: "absolute",
                top: 100,
                flex: 0.5,
                marginTop: 10,
                color: "#FFF006", // white
                opacity: fadeAnim,
              }, // yellow
            ]}
          >
            Type your answer
          </Animated.Text>
          <View style={{ flex: 1.7, justifyContent: "center", marginTop: 100 }}>
            <Text
              style={[
                GlobalStyles.title,
                { color: "#F5FCFF", fontSize: 50 }, // white
              ]}
            >
              {question.operand1} {question.operator} {question.operand2} = ?
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
              {resultMessage ? (
                <Text
                  style={[
                    GlobalStyles.title,
                    {
                      fontSize: 26,
                      color: isCorrect ? "#4bea69" : "#d22209", // 초록색 정답, 빨간색 오답
                    },
                  ]}
                >
                  {resultMessage}
                </Text>
              ) : null}
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
});
