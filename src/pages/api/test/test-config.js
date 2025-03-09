import authMiddleware from "@/utils/authMiddleware";
import { TestConfig, sequelize } from "@/utils/db";
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

    const { testId, poolConfigs } = req.body; // Array of { poolId, numberOfQuestions }

    const transaction = await sequelize.transaction();

    try {
      await TestConfig.destroy({ where: { testId }, transaction }); // Remove existing config

      await TestConfig.bulkCreate(
        poolConfigs.map((config) => ({
          testId,
          ...config,
        })),
        { transaction }
      );

      await transaction.commit();

      const updatedConfigs = await TestConfig.findAll({ where: { testId } });

      res.status(201).json({ message: "Test configuration saved", configs: updatedConfigs });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      message: "Error saving test configuration",
      error: error.message,
    });
  }
}
