const Workout = require('../models/Workout');

// 🗓 Weekly Progress
exports.getWeeklyProgress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Use req.userId (NOT req.user.id)

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const workouts = await Workout.find({
      userId,
      date: { $gte: oneWeekAgo }
    });

    let totalDuration = 0;
    let totalCalories = 0;

    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        totalDuration += ex.duration || 0;
        totalCalories += ((ex.duration || 0) * (ex.weight || 0)) / 5;
      });
    });

    res.json({ totalDuration, totalCalories });
  } catch (err) {
    console.error('Error fetching weekly progress:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📅 Daily Progress
exports.getDailyProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({
      userId,
      date: { $gte: today }
    });

    let totalDuration = 0;
    let totalCalories = 0;

    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        totalDuration += ex.duration || 0;
        totalCalories += ((ex.duration || 0) * (ex.weight || 0)) / 5;
      });
    });

    res.json({ totalDuration, totalCalories });
  } catch (err) {
    console.error('Error fetching daily progress:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
