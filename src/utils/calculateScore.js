import { Answer } from "./db";

export default async function calculateScoreAndSaveAnswers(studentId, testId, answers, questions, transaction) {
  let score = 0;

  for (const ans of answers) {
    const question = questions.find((q) => q.id === ans.questionId);

    if (!question) {
      continue;
    }

    console.log(`Processing questionId: ${ans.questionId}, Answer received:`, ans.studentAnswer);

    const studentAnswer = ans.studentAnswer ? JSON.stringify(ans.studentAnswer) : "[]";

    const isCorrect = JSON.stringify(question.correctAnswer) === studentAnswer;

    if (isCorrect) {
      score += question.weight;
    }

    await Answer.create(
      {
        studentId,
        testId,
        questionId: ans.questionId,
        studentAnswer,
        isCorrect,
      },
      { transaction }
    );
  }

  return score;
}