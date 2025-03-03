import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import User from "./user.model";
import Test from "./test.model";

interface TestResultAttributes {
  id: number;
  studentId: number;
  testId: number;
  score: number;
  completedAt?: Date;
  attemptNumber: number;
}

class TestResult extends Model<
  TestResultAttributes,
  Optional<TestResultAttributes, "id">
> {
  static initModel(sequelize: Sequelize) {
    TestResult.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
        },
        testId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Test,
            key: "id",
          },
        },
        score: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        completedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        attemptNumber: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: "TestResults",
        timestamps: false,
      }
    );
  }

  static associate() {
    User.hasMany(TestResult, { foreignKey: "studentId" });
    Test.hasMany(TestResult, { foreignKey: "testId" });
    TestResult.belongsTo(User, { foreignKey: "studentId" });
    TestResult.belongsTo(Test, { foreignKey: "testId" });
  }
}

export default TestResult;
