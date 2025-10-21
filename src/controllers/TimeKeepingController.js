const TimeKeeping = require('../models/TimeKeeping');
const { Op } = require('sequelize');

// Lấy chấm công của teacher (Loai = 2)
exports.teacherTimekeeping = async (req, res, next) => {
  try {
    const { startDate, endDate, teacherId, page = 1, limit = 50 } = req.query;
    
    // Tạo điều kiện where
    const whereCondition = {
      Loai: 2 // Teacher timekeeping
    };

    // Thêm filter theo teacherId nếu có
    if (teacherId) {
      whereCondition.NguoiChamCong = teacherId;
    }

    // Thêm filter theo khoảng thời gian nếu có
    if (startDate && endDate) {
      whereCondition.ThoiGian = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereCondition.ThoiGian = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereCondition.ThoiGian = {
        [Op.lte]: new Date(endDate)
      };
    }

    // Tính toán offset cho pagination
    const offset = (page - 1) * limit;

    // Lấy dữ liệu với pagination
    const { count, rows } = await TimeKeeping.findAndCountAll({
      where: whereCondition,
      order: [['ThoiGian', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Trả về kết quả
    res.json({
      success: true,
      data: {
        records: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching teacher timekeeping:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu chấm công của giáo viên',
      error: error.message
    });
  }
};

// Lấy chấm công của staff (Loai = 1)
exports.staffTimekeeping = async (req, res, next) => {
  try {
    const { startDate, endDate, staffId, page = 1, limit = 50 } = req.query;
    
    // Tạo điều kiện where
    const whereCondition = {
      Loai: 1 // Staff timekeeping
    };

    // Thêm filter theo staffId nếu có
    if (staffId) {
      whereCondition.NguoiChamCong = staffId;
    }

    // Thêm filter theo khoảng thời gian nếu có
    if (startDate && endDate) {
      whereCondition.ThoiGian = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereCondition.ThoiGian = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereCondition.ThoiGian = {
        [Op.lte]: new Date(endDate)
      };
    }

    // Tính toán offset cho pagination
    const offset = (page - 1) * limit;

    // Lấy dữ liệu với pagination
    const { count, rows } = await TimeKeeping.findAndCountAll({
      where: whereCondition,
      order: [['ThoiGian', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Trả về kết quả
    res.json({
      success: true,
      data: {
        records: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching staff timekeeping:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu chấm công của nhân viên',
      error: error.message
    });
  }
};

// Lấy thống kê chấm công theo người dùng
exports.getTimekeepingStats = async (req, res, next) => {
  try {
    const { userId, startDate, endDate, loai } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu userId'
      });
    }

    const whereCondition = {
      NguoiChamCong: userId
    };

    // Thêm filter theo loại nếu có
    if (loai) {
      whereCondition.Loai = loai;
    }

    // Thêm filter theo thời gian nếu có
    if (startDate && endDate) {
      whereCondition.ThoiGian = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const records = await TimeKeeping.findAll({
      where: whereCondition,
      order: [['ThoiGian', 'ASC']]
    });

    // Tính toán thống kê
    const stats = {
      totalRecords: records.length,
      uniqueDays: new Set(records.map(r => r.ThoiGian.toDateString())).size,
      firstCheckin: records[0]?.ThoiGian || null,
      lastCheckin: records[records.length - 1]?.ThoiGian || null
    };

    res.json({
      success: true,
      data: {
        stats,
        records
      }
    });
  } catch (error) {
    console.error('Error fetching timekeeping stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê chấm công',
      error: error.message
    });
  }
};
