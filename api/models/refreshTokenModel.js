const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    token_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "token",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = RefreshToken;
