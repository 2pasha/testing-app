import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Test from "./test.model";

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
          references: {
            model: Test,
            key: "id",
          },
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

  static associate() {
    Test.hasMany(Question, { foreignKey: "testId" });
    Question.belongsTo(Test, { foreignKey: "testId" });
  }
}

export default Question;
