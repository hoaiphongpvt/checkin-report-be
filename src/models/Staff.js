const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Staff = sequelize.define(
  'Staff',
  {
    StaffID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    StaffName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    Note: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    MaHoSo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'Staff',
    timestamps: false,
    freezeTableName: true,
  }
)

module.exports = Staff
