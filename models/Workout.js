const mongoose = require('mongoose'); // Import mongoose

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    exercises: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        sets: {
            type: Number,
            required: true,
            min: 1
        },
        reps: {
            type: Number,
            required: true,
            min: 1
        },
        weight: {
            type: Number,
            required: true,
            min: 0
        },
        duration: { // Added duration
            type: Number,
            required: false, // Make duration optional
            min: 0
        }
    }],
    date: { // Added date
        type: Date,
        default: Date.now
    },
    userId: { // Add userId for tracking
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Corrected ref
        required: true
    }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
