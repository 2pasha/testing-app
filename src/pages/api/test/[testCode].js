import authMiddleware from "@/utils/authMiddleware";
import { Question, GeneratedTest } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { testCode } = req.query;

    const generatedTest = await GeneratedTest.findByPk(testCode);
    if (!generatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = await Question.findAll({
      where: { id: generatedTest.questionIds },
    });

    res.status(200).json({ testCode, questions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving test", error: error.message });
  }
}
