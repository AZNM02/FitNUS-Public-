const mongoose = require("mongoose");


const MealDetailSchema = new mongoose.Schema({
    name: String,
    calories: String,
    date: {type:Date, default: Date.now,},
},{
    collection: "MealInfo"
});

mongoose.model("MealInfo", MealDetailSchema);