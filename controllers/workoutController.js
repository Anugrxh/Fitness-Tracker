const Workout = require('../models/Workout');

// Create a new workout
exports.createWorkout = async (req, res) => {
  try {
    const { title, exercises, date } = req.body;

    const newWorkout = new Workout({
      userId: req.userId,  // updated field name
      title,
      exercises,
      date: date || Date.now()
    });

    await newWorkout.save();
    res.status(201).json({ message: 'Workout created', workout: newWorkout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all workouts for a user
exports.getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a workout
exports.updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workout = await Workout.findOne({ _id: workoutId, userId: req.userId });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found or unauthorized' });
    }

    const { title, exercises, date } = req.body;

    if (title) workout.title = title;
    if (exercises) workout.exercises = exercises;
    if (date) workout.date = date;

    await workout.save();

    res.status(200).json({ message: 'Workout updated', workout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const deleted = await Workout.findOneAndDelete({ _id: workoutId, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ error: 'Workout not found or unauthorized' });
    }

    res.status(200).json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
