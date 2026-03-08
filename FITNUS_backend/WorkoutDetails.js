const mongoose = require("mongoose");

const WorkoutDetailSchema = new mongoose.Schema({
    name: String,
    duration: String,
    weight: String,
    reps: String,
    distance: String,
    date: {type: Date, default: Date.now},
},{
    collection: "WorkoutInfo"
});

mongoose.model("WorkoutInfo", WorkoutDetailSchema);