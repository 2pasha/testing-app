import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface TestAttributes {
  id: number;
  teacherId: number;
  testName: string;
  testDescription: string;
  createdAt?: Date;
  isActive: boolean;
}

class Test extends Model<TestAttributes, Optional<TestAttributes, "id">> {
  static initModel(sequelize: Sequelize) {
    Test.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        teacherId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        testName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        testDescription: {
          type: DataTypes.TEXT,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "Tests",
        timestamps: false,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    if (!models.User || !(models.User.prototype instanceof Model)) {
      throw new Error("User model is not initialized");
    }
    if (!models.Question || !(models.Question.prototype instanceof Model)) {
      throw new Error("Question model is not initialized");
    }
    if (!models.TestResult || !(models.TestResult.prototype instanceof Model)) {
      throw new Error("TestResult model is not initialized");
    }
    if (!models.TestConfig || !(models.TestConfig.prototype instanceof Model)) {
      throw new Error("TestConfig model is not initialized");
    }

    Test.belongsTo(models.User, { foreignKey: "teacherId" });
    Test.hasMany(models.Question, { foreignKey: "testId", as: "questions" });
    Test.hasMany(models.TestResult, { foreignKey: "testId", as: "TestResults" });
    Test.hasMany(models.TestConfig, { foreignKey: "testId", as: "TestConfigs" });
  }
}

const initializeTestModel = (sequelize: Sequelize) => {
  Test.initModel(sequelize);

  return Test;
};

export default initializeTestModel;
