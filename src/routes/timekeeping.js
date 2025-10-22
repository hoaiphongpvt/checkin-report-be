const express = require('express')
const router = express.Router()
const teacherTimekeepingController = require('../controllers/timekeeping/TeacherTimekeepingController')
const staffTimekeepingController = require('../controllers/timekeeping/StaffTimekeepingController')
const timekeepingStatsController = require('../controllers/timekeeping/TimekeepingStatsController')

router.get(
  '/api/timekeeping/teacher',
  teacherTimekeepingController.getTeacherTimekeeping
)

router.get(
  '/api/timekeeping/staff',
  staffTimekeepingController.getStaffTimekeeping
)

router.get(
  '/api/timekeeping/stats',
  timekeepingStatsController.getTimekeepingStats
)

module.exports = router
