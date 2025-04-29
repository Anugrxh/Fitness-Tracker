const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const { authenticate } = require('../middlewares/auth');

// Track total duration and calories burned for a specific workout
router.get('/trackAllWorkouts', authenticate, trackController.trackAllWorkouts);
router.get('/track/:workoutId', authenticate, trackController.trackDurationAndCalories);


module.exports = router;
