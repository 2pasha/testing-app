import { sequelize } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await sequelize.authenticate();

    res.status(200).json({ message: "DB connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "DB connection failed", error });
  }
}
