export type Comparison = {
  left: number;
  right: number;
};

export function generateComparison(): Comparison {
  const left = Math.floor(Math.random() * 999) + 1;
  const right = Math.floor(Math.random() * 999) + 1;
  return { left, right };
}

export function evaluateComparison(
  left: number,
  right: number,
  operator: string
): boolean {
  if (operator === ">") return left > right;
  if (operator === "=") return left === right;
  if (operator === "<") return left < right;
  return false;
}

export const MESSAGES = {
  CORRECT: ["Correct!", "Great!", "Super!", "Way to go!", "Excellent!"],
  INCORRECT: ["Try again", "Not quite", "Oops, almost!", "Keep trying!"],
};

export function getRandomMessage(messages: string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
