import { DataTypes, Model, Optional, Sequelize } from "sequelize";

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
        },
        testId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    if (!models.Test || !(models.Test.prototype instanceof Model)) {
      throw new Error("Test model is not initialized");
    }

    if (!models.User || !(models.User.prototype instanceof Model)) {
      throw new Error("User model is not initialized");
    }

    models.User.hasMany(TestResult, { foreignKey: "studentId" });
    models.Test.hasMany(TestResult, { foreignKey: "testId" });

    TestResult.belongsTo(models.Test, { foreignKey: "testId" });
    TestResult.belongsTo(models.User, { foreignKey: "studentId" });
  }
}

const initializeTestResultModel = (sequelize: Sequelize) => {
  TestResult.initModel(sequelize);

  return TestResult;
};

export default initializeTestResultModel;
