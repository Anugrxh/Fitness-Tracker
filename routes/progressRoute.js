const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const progressController = require('../controllers/progressController');

router.get('/weekly', authenticate, progressController.getWeeklyProgress);
router.get('/daily', authenticate, progressController.getDailyProgress);

module.exports = router;
