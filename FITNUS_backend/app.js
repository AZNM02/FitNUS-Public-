require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl).then(() => {
    console.log("Connected to Database")
})
.catch((e) => {
    console.log(e)
});

require('./MealDetails');
require('./WorkoutDetails');
const Meal = mongoose.model("MealInfo");
const Workout = mongoose.model("WorkoutInfo");

app.get("/",(req,res)=>{
    res.send({status:"Started"});
});

const dateFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
};

app.post('/addmeal',async(req,res)=>{
    const {name,calories,date} = req.body;
    try {
        await Meal.create({
            name:name,
            calories:calories,
        });
        res.send({status:'ok',data: "Meal Added"});
    } catch (error) {
        res.send({status:'error',data:error});
        
    }

});


app.post('/addworkout',async(req,res)=>{
    const {name,duration,weight,reps,distance} = req.body;
    try {
        await Workout.create({
            name:name,
            duration:duration,
            weight:weight,
            reps:reps,
            distance:distance,
        });
        res.send({status:'ok',data: "Workout Added"});
    } catch (error) {
        res.send({status:'error',data:error});
        
    }

});

app.get('/meals', async (req, res) => {
    try {
      const meals = await Meal.find();
      res.json(meals);
    } catch (error) {
      res.send({ status: 'error', data: error });
    }
  });


app.get('/exercises', async (req, res) => {
    try {
      const exercises = await Workout.find();
      res.json(exercises);
    } catch (error) {
      res.send({ status: 'error', data: error });
    }
  });



app.listen(5001, () =>{
    console.log("Server started.");

});