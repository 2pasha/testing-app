import { DataTypes, Model, Optional, Sequelize } from "sequelize";

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
        },
        testId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        questionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    if (!models.User || !(models.User.prototype instanceof Model)) {
      throw new Error("User model is not initialized");
    }

    if (!models.Test || !(models.Test.prototype instanceof Model)) {
      throw new Error("Test model is not initialized");
    }

    if (!models.Question || !(models.Question.prototype instanceof Model)) {
      throw new Error("Question model is not initialized");
    }

    models.User.hasMany(Answer, { foreignKey: "studentId" });
    models.Test.hasMany(Answer, { foreignKey: "testId" });
    models.Question.hasMany(Answer, { foreignKey: "questionId" });

    Answer.belongsTo(models.User, { foreignKey: "studentId" });
    Answer.belongsTo(models.Test, { foreignKey: "testId" });
    Answer.belongsTo(models.Question, { foreignKey: "questionId" });
  }
}

const initializeAnswerModel = (sequelize: Sequelize) => {
  Answer.initModel(sequelize);

  return Answer;
};

export default initializeAnswerModel;
