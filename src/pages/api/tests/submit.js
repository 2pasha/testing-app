import authMiddleware from "@/utils/authMiddleware";
import calculateScoreAndSaveAnswers from "@/utils/calculateScore";
import { Question, sequelize, TestResult } from "@/utils/db";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      autorize(["student"])(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { testId, answers } = req.body;

    const questions = await Question.findAll({ where: { testId } });

    if (!questions.length) {
      return res.status(404).json({ message: "Questions not found" });
    }

    const transaction = await sequelize.transaction();

    try {
      const score = await calculateScoreAndSaveAnswers(req.user.id, testId, answers, questions, transaction);

      await TestResult.create(
        {
          studentId: req.user.id,
          testId,
          score,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json({ message: "Test submitted successfully", score });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting test", error: error.message });
  }
}
