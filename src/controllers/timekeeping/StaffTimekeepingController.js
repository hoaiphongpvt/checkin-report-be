const TimeKeeping = require('../../models/TimeKeeping')
const { Op } = require('sequelize')
const Sequelize = require('sequelize') // Import Sequelize
const { parseDateForFilter, formatDateToMSSQLString } = require('../../utils/formatDate')

// Lấy chấm công của staff (Loai = 1)
exports.getStaffTimekeeping = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      staffId,
      noMapPlaceId,
      nullIslandAddress,
      noMapPlaceIdAndNotNullIsland,
      page = 1,
      limit = 50,
    } = req.query

    const conditions = [{ Loai: 1 }] // Staff timekeeping

    // Thêm filter theo staffId nếu có
    if (staffId) {
      conditions.push({ NguoiChamCong: staffId })
    }

    // Thêm filter theo khoảng thời gian nếu có
    const parsedStartDate = parseDateForFilter(startDate)
    const parsedEndDate = parseDateForFilter(endDate, true)

    if (parsedStartDate && parsedEndDate) {
      conditions.push({
        ThoiGian: {
          [Op.between]: [
            Sequelize.literal(`'${formatDateToMSSQLString(parsedStartDate)}'`),
            Sequelize.literal(`'${formatDateToMSSQLString(parsedEndDate)}'`),
          ],
        },
      });
    } else if (parsedStartDate) {
      conditions.push({ ThoiGian: { [Op.gte]: Sequelize.literal(`'${formatDateToMSSQLString(parsedStartDate)}'`) } });
    } else if (parsedEndDate) {
      conditions.push({ ThoiGian: { [Op.lte]: Sequelize.literal(`'${formatDateToMSSQLString(parsedEndDate)}'`) } });
    }

    if (noMapPlaceId === 'true') {
      conditions.push({ MapPlaceID: { [Op.is]: null } })
    }

    if (nullIslandAddress === 'true') {
      conditions.push({ DiaChi: 'Null Island' })
    }

    if (noMapPlaceIdAndNotNullIsland === 'true') {
      conditions.push({
        MapPlaceID: { [Op.is]: null },
        DiaChi: { [Op.ne]: 'Null Island' },
      })
    }

    const whereCondition = { [Op.and]: conditions }

    const offset = (page - 1) * limit

    const { count, rows } = await TimeKeeping.findAndCountAll({
      where: whereCondition,
      order: [['ThoiGian', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    })

    res.json({
      success: true,
      data: {
        records: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching staff timekeeping:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu chấm công của nhân viên',
      error: error.message,
    })
  }
}
