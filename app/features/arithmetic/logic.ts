export type Question = {
  operand1: number;
  operand2: number;
  operator: string;
  answer: number;
};

export function generateQuestion(): Question {
  let operand1 = Math.floor(Math.random() * 100) + 1; // 1~10
  let operand2 = Math.floor(Math.random() * 10) + 1; // 1~10
  const operators = ["+", "-", "*"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let answer;

  if (operator === "+") {
    answer = operand1 + operand2;
  } else if (operator === "-") {
    // 빼기의 결과가 음수가 되지 않도록 순서 조정
    if (operand1 < operand2) {
      [operand1, operand2] = [operand2, operand1];
    }
    answer = operand1 - operand2;
  } else if (operator === "*") {
    answer = operand1 * operand2;
  }

  return { operand1, operand2, operator, answer };
}

export function checkAnswer(
  userAnswer: number,
  correctAnswer: number
): boolean {
  return userAnswer === correctAnswer;
}

export const MESSAGES = {
  CORRECT: [
    "Correct!",
    "Great!",
    "Genius!",
    "Way to go!",
    "Excellent!",
    "Yay!",
  ],
  INCORRECT: [
    "Try again",
    "Not quite",
    "Oops!",
    "Keep trying!",
    "Almost there!",
    "Think again...",
  ],
};

export function getRandomMessage(messages: string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
