import authMiddleware from "@/utils/authMiddleware";
import { Test, TestResult } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  authMiddleware(req, res, async () => {
    try {
      const { id, role } = req.user;

      if (role === "teacher") {
        const tests = await Test.findAll({ where: { teacherId: id } });

        return res.json({ tests });
      }

      if (role === "student") {
        const completedTests = await TestResult.findAll({
          where: { studentId: id },
          include: [{ model: Test }],
        });

        return res.json({ tests: completedTests });
      }

      res.status(403).json({ message: "Invalid role" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching tests", error: error.message });
    }
  });
}
