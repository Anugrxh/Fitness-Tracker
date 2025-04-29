const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { authenticate } = require('../middlewares/auth');

// Create workout
router.post('/addWorkout', authenticate, workoutController.createWorkout);

// Get all workouts for logged-in user
router.get('/getAllWorkout', authenticate, workoutController.getUserWorkouts);

// Update workout
router.put('/:workoutId', authenticate, workoutController.updateWorkout); // Fixed route path

// Delete workout
router.delete('/:workoutId', authenticate, workoutController.deleteWorkout); // Fixed route path

module.exports = router;
