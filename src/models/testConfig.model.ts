import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface TestConfigAttributes {
  id: number;
  testId: number;
  poolId: number;
  numberOfQuestions: number;
}

class TestConfig extends Model<
  TestConfigAttributes,
  Optional<TestConfigAttributes, "id">
> {
  static initModel(sequelize: Sequelize) {
    TestConfig.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        testId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        poolId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        numberOfQuestions: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        sequelize,
        tableName: "TestConfigs",
        timestamps: false
      }
    )
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    if (!models.Test || !(models.Test.prototype instanceof Model)) {
      throw new Error("Test model is not initialized");
    }

    TestConfig.belongsTo(models.Test, { foreignKey: "testId", as: "Test" });
  }
}

const initializeTestConfigModel = (sequelize: Sequelize) => {
  TestConfig.initModel(sequelize);

  return TestConfig;
};

export default initializeTestConfigModel;
