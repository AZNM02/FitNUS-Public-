const mongoose = require("mongoose");

const MealDetailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
}, {
    collection: "MealInfo"
});

mongoose.model("MealInfo", MealDetailSchema);