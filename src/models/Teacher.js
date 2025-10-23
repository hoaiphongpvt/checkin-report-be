const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Teacher = sequelize.define(
  'Teacher',
  {
    TeacherID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    TeacherName: {
      type: DataTypes.STRING(256),
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
    Vietnamese: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Note: {
      type: DataTypes.TEXT, // nvarchar(-1) usually maps to TEXT
      allowNull: true,
    },
    Status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    Address: {
      type: DataTypes.TEXT, // nvarchar(-1) usually maps to TEXT
      allowNull: true,
    },
    ProfileID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ODegree: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NDegree: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    OTeachCert: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isTA: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isTeacher: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Degree: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    Cert: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    MaHoSo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Exp: {
      type: DataTypes.TEXT, // nvarchar(-1) usually maps to TEXT
      allowNull: true,
    },
  },
  {
    tableName: 'Teacher',
    timestamps: false,
    freezeTableName: true,
  }
)

module.exports = Teacher
