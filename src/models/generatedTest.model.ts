import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface GeneratedTestAttributes {
  id: number;
  testId: number;
  questionIds: number[];
}

class GeneratedTest extends Model<
  GeneratedTestAttributes,
  Optional<GeneratedTestAttributes, "id">
> {
  static initModel(sequelize: Sequelize) {
    GeneratedTest.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        testId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        questionIds: {
          type: DataTypes.JSONB, // Stores selected question IDs
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "GeneratedTests",
        timestamps: false
      }
    )
  }
}

const initializeGeneratedTestModel = (sequelize: Sequelize) => {
  GeneratedTest.initModel(sequelize);

  return GeneratedTest;
};

export default initializeGeneratedTestModel;
