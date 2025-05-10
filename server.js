const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares
app.use(express.json());
// const cors = require('cors');
// app.use(cors()); // Uncomment if using frontend on a different port

// Database connection
require('./config/db')();


// ✅ Use Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Use Track routes
const trackRoutes = require('./routes/trackRoute');
app.use('/api/track', trackRoutes);

// ✅ Use Workout routes
const workoutRoutes = require('./routes/workoutRoute');
app.use('/api/workouts', workoutRoutes);

// ✅ Use Progress routes
const progressRoutes = require('./routes/progressRoute');
app.use('/api/progress', progressRoutes);





// Optional base route
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
