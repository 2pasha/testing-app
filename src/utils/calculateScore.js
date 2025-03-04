import { Answer } from "./db";

export default async function calculateScoreAndSaveAnswers(studentId, testId, answers, questions, transaction) {
  let score = 0;

  for (const ans of answers) {
    const question = questions.find((q) => q.id === ans.questionId);

    if (!question) {
      continue;
    }

    const isCorrect = JSON.stringify(question.correctAnswer) === JSON.stringify(ans.studentAnswer);

    if (isCorrect) {
      score += question.weight;
    }

    await Answer.create(
      {
        studentId,
        testId,
        questionId: ans.questionId,
        studentAnswer: ans.studentAnswer,
        isCorrect,
      },
      { transaction }
    );
  }

  return score;
}