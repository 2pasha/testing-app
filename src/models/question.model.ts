import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface QuestionAttributes {
  id: number;
  testId: number;
  questionType: "single_choice" | "multiple_choice" | "text" | "compliance";
  questionText: string;
  questionOptions: object;
  correctAnswer: object;
  weight: number;
}

class Question extends Model<
  QuestionAttributes,
  Optional<QuestionAttributes, "id">
> {
  static initModel(sequelize: Sequelize) {
    Question.init(
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
        questionType: {
          type: DataTypes.ENUM(
            "single_choice",
            "multiple_choice",
            "text",
            "true_false"
          ),
          allowNull: false,
        },
        questionText: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        questionOptions: {
          type: DataTypes.JSONB, // Stores possible answers
          allowNull: false,
        },
        correctAnswer: {
          type: DataTypes.JSONB, // Stores correct answer(s)
          allowNull: false,
        },
        weight: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: "Questions",
        timestamps: false,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    if (!models.Test || !(models.Test.prototype instanceof Model)) {
      throw new Error("Test model is not initialized");
    }

    if (!models.Answer || !(models.Answer.prototype instanceof Model)) {
      throw new Error("Answer model is not initialized");
    }

    Question.belongsTo(models.Test, { foreignKey: "testId" });
    Question.belongsTo(models.Answer, { foreignKey: "answerId" });
  }

  // Test.hasMany(Question, { foreignKey: "testId" });
  // Question.belongsTo(Test, { foreignKey: "testId" });
}

const initializeQuestionModel = (sequelize: Sequelize) => {
  Question.initModel(sequelize);

  return Question;
};

export default initializeQuestionModel;
