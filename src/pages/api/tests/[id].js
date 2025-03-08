import authMiddleware from "@/utils/authMiddleware";
import { Question, Test, TestResult, TestConfig } from "@/utils/db";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      autorize(["teacher"])(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { id } = req.query;

    const test = await Test.findByPk(id, {
      include: [
        { model: Question, as: "questions" },
        { model: TestResult, as: "TestResults" },
        { model: TestConfig, as: "TestConfigs" },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({ test });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching test", error: error.message });
  }
}
