const express = require('express')
const router = express.Router()
const timeKeepingController = require('../controllers/TimeKeepingController')

router.get('/timekeeping/teacher', timeKeepingController.teacherTimekeeping)

router.get('/timekeeping/staff', timeKeepingController.staffTimekeeping)

module.exports = router
