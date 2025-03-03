import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import User from "./user.model";

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
          references: {
            model: User,
            key: "id",
          },
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

  static associate() {
    User.hasMany(Test, { foreignKey: "teacherId" });
    Test.belongsTo(User, { foreignKey: "teacherId" });
  }
}

export default Test;
