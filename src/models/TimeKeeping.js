const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const TimeKeeping = sequelize.define(
  'ChamCong',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ThoiGian: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian chấm công',
    },
    MapPlaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID địa điểm',
    },
    NguoiChamCong: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID người chấm công',
    },
    Loai: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Loại teacher/staff',
    },
    HinhThuc: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Hình thức chấm công',
    },
    DiaChi: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Địa chỉ chấm công',
    },
    File: {
      type: DataTypes.STRING(250),
      allowNull: true,
      comment: 'File đính kèm',
    },
    GhiChu: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ghi chú',
    },
  },
  {
    tableName: 'ChamCong',
    timestamps: false, // Không sử dụng createdAt, updatedAt
    freezeTableName: true, // Không tự động chuyển đổi tên bảng sang số nhiều
  }
)

module.exports = TimeKeeping
