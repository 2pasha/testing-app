import development from '../config/database';
import { Sequelize } from 'sequelize';
import User from '../models/user.model';
import Test from '../models/test.model';
import Answer from '../models/answer.model';
import Question from '../models/question.model';
import TestResult from '../models/testResult.model';

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
    }
  }
)

User.initModel(sequelize);
Test.initModel(sequelize);
Question.initModel(sequelize);
TestResult.initModel(sequelize);
Answer.initModel(sequelize);

User.associate();
Test.associate();
Question.associate();
TestResult.associate();
Answer.associate();

export default sequelize;