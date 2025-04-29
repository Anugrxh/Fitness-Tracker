const Workout = require('../models/Workout');

// Track total duration and calories burned
exports.trackDurationAndCalories = async (req, res) => {
  try {
    const { workoutId } = req.params; // Get the workout ID from the request
    const workout = await Workout.findById(workoutId).populate('userId');

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Calculate total workout duration
    const totalDuration = workout.exercises.reduce((total, exercise) => total + exercise.duration, 0);

    // Calculate calories burned (rough estimate: 10 calories per minute of exercise)
    const caloriesBurned = totalDuration * 0.17; // You can adjust this factor based on the user and type of exercise

    // Respond with the calculated data
    res.status(200).json({
      message: 'Workout duration and calories tracked',
      totalDuration,
      caloriesBurned
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Track total duration and calories burned across all workouts of the user
exports.trackAllWorkouts = async (req, res) => {
    try {
      const userId = req.userId;
  
      const workouts = await Workout.find({ userId });
  
      if (!workouts || workouts.length === 0) {
        return res.status(404).json({ message: 'No workouts found for user' });
      }
  
      let totalDuration = 0;
  
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          totalDuration += exercise.duration || 0;
        });
      });
  
      const caloriesBurned = totalDuration * 0.17; // Rough estimate: 0.17 kcal/sec
  
      res.status(200).json({
        totalWorkouts: workouts.length,
        totalDurationInSeconds: totalDuration,
        caloriesBurned: caloriesBurned.toFixed(2)
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };