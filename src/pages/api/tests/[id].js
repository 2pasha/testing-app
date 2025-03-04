import { Question, Test } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    const test = await Test.findByPk(id, {
      include: [{ model: Question, as: "questions" }],
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
