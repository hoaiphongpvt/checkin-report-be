const TimeKeeping = require('../../models/TimeKeeping')
const Staff = require('../../models/Staff') // Import Staff model
const { Op } = require('sequelize')
const Sequelize = require('sequelize') // Import Sequelize
const {
  parseDateForFilter,
  formatDateToMSSQLString,
} = require('../../utils/formatDate')

// Lấy chấm công của staff (Loai = 1)
exports.getStaffTimekeeping = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      staffName, // Add staffName to query parameters
      noMapPlaceId,
      nullIslandAddress,
      noMapPlaceIdAndNotNullIsland,
      page = 1,
      limit = 50,
    } = req.query

    const conditions = [{ Loai: 1 }] // Staff timekeeping

    // If staffName is provided, find the StaffIDs that match
    if (staffName) {
      const matchingStaffIds = await Staff.findAll({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('StaffName')),
          { [Op.like]: `%${staffName.toLowerCase()}%` }
        ),
        attributes: ['StaffID'],
      }).then(staffs => staffs.map(s => s.StaffID));

      if (matchingStaffIds.length > 0) {
        conditions.push({ NguoiChamCong: { [Op.in]: matchingStaffIds } });
      } else {
        // If no staff found with the given name, ensure no TimeKeeping records are returned
        conditions.push({ NguoiChamCong: null }); // Or any condition that yields no results
      }
    }

    const staffInclude = {
      model: Staff,
      as: 'staff', // Alias for the Staff model
      attributes: ['StaffName'],
      required: false, // Always use left join to get the name
    };

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
      })
    } else if (parsedStartDate) {
      conditions.push({
        ThoiGian: {
          [Op.gte]: Sequelize.literal(
            `'${formatDateToMSSQLString(parsedStartDate)}'`
          ),
        },
      })
    } else if (parsedEndDate) {
      conditions.push({
        ThoiGian: {
          [Op.lte]: Sequelize.literal(
            `'${formatDateToMSSQLString(parsedEndDate)}'`
          ),
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

    const offset = (page - 1) * limit

    const { count, rows } = await TimeKeeping.findAndCountAll({
      where: whereCondition,
      order: [['ThoiGian', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
      include: [staffInclude],
    })

    // Map the results to include staffName directly in the record
    const recordsWithNames = rows.map((record) => ({
      ...record.toJSON(),
      StaffName: record.staff ? record.staff.StaffName : '',
    }))

    res.json({
      success: true,
      data: {
        records: recordsWithNames,
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
