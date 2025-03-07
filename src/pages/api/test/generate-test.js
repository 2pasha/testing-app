import authMiddleware from "@/utils/authMiddleware";
import { TestConfig, Question, GeneratedTest, sequelize } from "@/utils/db";
import { autorize } from "@/utils/roleMiddleware";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      autorize(["teacher"])(req, res, (err) =>
        err ? reject(err) : resolve()
      );
    });

    const { testId } = req.body;
    const transaction = await sequelize.transaction();

    try {
      // Fetch test configuration
      const testConfig = await TestConfig.findAll({
        where: { testId },
        transaction,
      });

      if (!testConfig.length) {
        return res
          .status(400)
          .json({ message: "Test configuration not found" });
      }

      let selectedQuestions = [];
      let totalExpectedQuestions = testConfig.reduce(
        (sum, config) => sum + config.numberOfQuestions,
        0
      );

      for (const config of testConfig) {
        const { poolId, numberOfQuestions } = config;
        const questions = await Question.findAll({
          where: { testId, poolId },
          transaction,
        });

        if (questions.length < numberOfQuestions) {
          await transaction.rollback();
          return res
            .status(400)
            .json({ message: `Not enough questions in pool ${poolId}` });
        }

        // Randomly select required number of questions
        const shuffled = questions.sort(() => 0.5 - Math.random());
        selectedQuestions.push(...shuffled.slice(0, numberOfQuestions));
      }

      if (selectedQuestions.length !== totalExpectedQuestions) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Configuration mismatch: Expected ${totalExpectedQuestions} questions, but got ${selectedQuestions.length}`,
        });
      }

      const generatedTestId = uuidv4();

      await GeneratedTest.create(
        {
          id: generatedTestId,
          testId,
          questionIds: selectedQuestions.map((q) => q.id),
        },
        { transaction }
      );

      await transaction.commit();
      res
        .status(201)
        .json({
          message: "Test generated successfully",
          testCode: generatedTestId,
          totalQuestions: selectedQuestions.length,
        });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating test", error: error.message });
  }
}
