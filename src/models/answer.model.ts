import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import User from "./user.model";
import Test from "./test.model";
import Question from "./question.model";

interface AnswerAttributes {
  id: number;
  studentId: number;
  testId: number;
  questionId: number;
  studentAnswer: object;
  isCorrect: boolean;
}

class Answer extends Model<AnswerAttributes, Optional<AnswerAttributes, "id">> {
  static initModel(sequelize: Sequelize) {
    super.init(
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
        questionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Question,
            key: "id",
          },
        },
        studentAnswer: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        isCorrect: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Answers",
        timestamps: false,
      }
    );
  }

  static associate() {
    User.hasMany(Answer, { foreignKey: "studentId" });
    Test.hasMany(Answer, { foreignKey: "testId" });
    Question.hasMany(Answer, { foreignKey: "questionId" });
    Answer.belongsTo(User, { foreignKey: "studentId" });
    Answer.belongsTo(Test, { foreignKey: "testId" });
    Answer.belongsTo(Question, { foreignKey: "questionId" });
  }
}

export default Answer;
