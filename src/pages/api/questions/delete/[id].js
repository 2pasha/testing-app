import authMiddleware from "@/utils/authMiddleware";
import { Question } from "@/utils/db";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Authenticate user
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    // Authorize only teachers
    await new Promise((resolve, reject) => {
      autorize(["teacher"])(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { id } = req.query;

    // Find the question
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Delete the question
    await question.destroy();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
}
