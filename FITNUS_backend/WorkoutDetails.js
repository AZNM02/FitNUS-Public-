const mongoose = require("mongoose");

const WorkoutDetailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: Number,
    sets: Number,
    weight: Number,
    reps: Number,
    distance: Number,
    notes: String,
    date: { type: Date, default: Date.now },
}, {
    collection: "WorkoutInfo"
});

mongoose.model("WorkoutInfo", WorkoutDetailSchema);