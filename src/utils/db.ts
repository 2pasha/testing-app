import development from "../config/database";
import { Sequelize } from "sequelize";
import getUserModel from "../models/user.model";
import getTestModel from "../models/test.model";
import getAnswerModel from "../models/answer.model";
import getQuestionModel from "../models/question.model";
import getTestResultModel from "../models/testResult.model";
import getTestConfigModel from "../models/testConfig.model";
import getGeneratedTestModel from "../models/generatedTest.model";

const sequelize = new Sequelize(
  development.database,
  development.username,
  development.password,
  {
    host: development.host,
    dialect: "postgres",
    logging: false,
    define: {
      freezeTableName: true,
    },
  }
);

const models = {
  User: getUserModel(sequelize),
  Test: getTestModel(sequelize),
  Question: getQuestionModel(sequelize),
  TestResult: getTestResultModel(sequelize),
  Answer: getAnswerModel(sequelize),
  TestConfig: getTestConfigModel(sequelize),
  GeneratedTest: getGeneratedTestModel(sequelize),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export const {
  User,
  Test,
  Question,
  TestResult,
  Answer,
  TestConfig,
  GeneratedTest,
} = models;
export { sequelize };
