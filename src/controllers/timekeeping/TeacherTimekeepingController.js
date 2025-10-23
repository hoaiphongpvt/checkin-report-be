const TimeKeeping = require('../../models/TimeKeeping')
const Teacher = require('../../models/Teacher') // Import Teacher model
const { Op } = require('sequelize')
const Sequelize = require('sequelize') // Import Sequelize
const {
  parseDateForFilter,
  formatDateToMSSQLString,
} = require('../../utils/formatDate')

// Lấy chấm công của teacher (Loai = 2)
exports.getTeacherTimekeeping = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      teacherName, // Add teacherName to query parameters
      noMapPlaceId,
      nullIslandAddress,
      noMapPlaceIdAndNotNullIsland,
      page = 1,
      limit = 50,
    } = req.query

    const conditions = [{ Loai: 2 }] // Teacher timekeeping

    // If teacherName is provided, find the TeacherIDs that match
    if (teacherName) {
      const matchingTeacherIds = await Teacher.findAll({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('TeacherName')),
          { [Op.like]: `%${teacherName.toLowerCase()}%` }
        ),
        attributes: ['TeacherID'],
      }).then(teachers => teachers.map(s => s.TeacherID));

      if (matchingTeacherIds.length > 0) {
        conditions.push({ NguoiChamCong: { [Op.in]: matchingTeacherIds } });
      } else {
        // If no teacher found with the given name, ensure no TimeKeeping records are returned
        conditions.push({ NguoiChamCong: null }); // Or any condition that yields no results
      }
    }

    const teacherInclude = {
      model: Teacher,
      as: 'teacher', // Alias for the Teacher model
      attributes: ['TeacherName'],
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
      include: [teacherInclude],
    })

    // Map the results to include teacherName directly in the record
    const recordsWithNames = rows.map((record) => ({
      ...record.toJSON(),
      TeacherName: record.teacher ? record.teacher.TeacherName : '',
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
    console.error('Error fetching teacher timekeeping:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu chấm công của giáo viên',
      error: error.message,
    })
  }
}
