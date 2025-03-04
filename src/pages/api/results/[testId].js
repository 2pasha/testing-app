import authMiddleware from "@/utils/authMiddleware";
import { Test, TestResult } from "@/utils/db";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      autorize(["teacher"])(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { testId } = req.query;
    const test = await Test.findByPk(testId);

    if (!test || test.teacherId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You don't own this test" });
    }

    const results = await TestResult.findAll({ where: { testId } });

    res.json({ results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching results", error: error.message });
  }
}
