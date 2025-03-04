import authMiddleware from "@/utils/authMiddleware";
import { TestResult } from "@/utils/db";
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
      autorize(["student"])(req, res, (err) =>
        err ? reject(err) : resolve()
      );
    });

    const result = await TestResult.findAll({
      where: { studentId: req.user.id },
    });

    res.json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching results", error: error.message });
  }
}
