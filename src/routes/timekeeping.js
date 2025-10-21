const express = require('express')
const router = express.Router()
const timeKeepingController = require('../controllers/TimeKeepingController')

router.get('/timekeeping/teacher', timeKeepingController.teacherTimekeeping)

router.get('/timekeeping/staff', timeKeepingController.staffTimekeeping)

router.get('/timekeeping/stats', timeKeepingController.getTimekeepingStats)

module.exports = router
