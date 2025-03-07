import { Question } from "@/utils/db";
import authMiddleware from "@/utils/authMiddleware";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  authMiddleware(req, res, async () => {
    try {
      await new Promise((resolve, reject) => {
        autorize(["teacher"])(req, res, (err) =>
          err ? reject(err) : resolve()
        );
      });

      const {
        testId,
        questionType,
        questionText,
        questionOptions = "",
        correctAnswer,
        weight,
        poolId,
      } = req.body;

      if (!testId || !questionType || !questionText || !correctAnswer || !poolId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newQuestion = await Question.create({
        testId,
        questionType,
        questionText,
        questionOptions,
        correctAnswer,
        weight,
        poolId,
      });

      res.status(201).json(newQuestion);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding question", error: error.message });
    }
  });
}
