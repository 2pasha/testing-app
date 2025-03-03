import { Test } from "@/utils/db";
import authMiddleware from "@/utils/authMiddleware";
import { autorize } from "@/utils/roleMiddleware";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      autorize(["teacher"])(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { testName, testDescription } = req.body;

    const test = await Test.create({
      teacherId: req.user.id,
      testName,
      testDescription,
    });

    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating test", error: error.message });
  }
}
