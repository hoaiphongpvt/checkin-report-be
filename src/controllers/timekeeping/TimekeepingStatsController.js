const TimeKeeping = require('../../models/TimeKeeping')
const { Op } = require('sequelize')
const Sequelize = require('sequelize') // Import Sequelize
const {
  parseDateForFilter,
  formatDateToMSSQLString,
} = require('../../utils/formatDate')

exports.getTimekeepingStats = async (req, res, next) => {
  try {
    const {
      userId,
      startDate,
      endDate,
      loai,
      noMapPlaceId,
      nullIslandAddress,
      noMapPlaceIdAndNotNullIsland,
    } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu userId',
      })
    }

    const conditions = [{ NguoiChamCong: userId }]

    // Thêm filter theo loại nếu có
    if (loai) {
      conditions.push({ Loai: loai })
    }

    // Thêm filter theo thời gian nếu có
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
      })
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

    const records = await TimeKeeping.findAll({
      where: whereCondition,
      order: [['ThoiGian', 'ASC']],
    })

    // Tính toán thống kê
    const stats = {
      totalRecords: records.length,
      uniqueDays: new Set(records.map((r) => r.ThoiGian.toDateString())).size,
      firstCheckin: records[0]?.ThoiGian || null,
      lastCheckin: records[records.length - 1]?.ThoiGian || null,
    }

    res.json({
      success: true,
      data: {
        stats,
        records,
      },
    })
  } catch (error) {
    console.error('Error fetching timekeeping stats:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê chấm công',
      error: error.message,
    })
  }
}
