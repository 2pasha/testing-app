import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

class User extends Model<UserAttributes, Optional<UserAttributes, "id">> {
  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM("student", "teacher"),
          allowNull: false,
          defaultValue: "student",
        },
      },
      {
        sequelize,
        tableName: "Users",
        timestamps: true, // Adds createdAt & updatedAt
        hooks: {
          beforeCreate: async (user) => {
            if (!user.getDataValue("password")) {
              throw new Error("Password is required");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
              user.getDataValue("password"),
              salt
            );

            user.setDataValue("password", hashedPassword);
          },
        },
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    if (!models.Test || !(models.Test.prototype instanceof Model)) {
      throw new Error("Test model is not initialized");
    }
    User.hasMany(models.Test, { foreignKey: "teacherId" });
  }
}

const initializeUserModel = (sequelize: Sequelize) => {
  User.initModel(sequelize);

  return User;
};

export default initializeUserModel;
