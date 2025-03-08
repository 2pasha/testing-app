import { Question } from "@/utils/db";
import authMiddleware from "@/utils/authMiddleware";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
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

    const { id } = req.query;
    const {
      questionText,
      questionType,
      questionOptions,
      correctAnswer,
      weight,
    } = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.update({
      questionText,
      questionType,
      questionOptions,
      correctAnswer,
      weight,
    });

    res.json({ message: "Question updated successfully", question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating question", error: error.message });
  }
}
