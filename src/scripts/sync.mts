/* eslint-disable @typescript-eslint/no-unused-vars */
import sequelize from "../utils/db.js";
import User from "../models/user.model.js";
import Test from '../models/test.model.js';
import Question from '../models/question.model.js';
import TestResult from '../models/testResult.model.js';
import Answer from '../models/answer.model.js';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await sequelize.sync({ alter: true });

    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to sync database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();

// npx tsc -> node dist/script/sunc.js